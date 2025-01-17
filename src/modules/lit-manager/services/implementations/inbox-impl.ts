import fs, {promises} from 'node:fs';
import readline from 'node:readline';
import { inject, injectable } from 'tsyringe';
import { type LitInputDTO, validateLitInput } from '../../models/dtos.js';
import type InboxService from '../interfaces/inbox-service.js';

@injectable()
export class InboxServiceImpl implements InboxService {
  constructor(@inject('filtered-file-path') private filteredPath: string) {
    this.singletonFile();
  }

  async getFilteredEmails(): Promise<LitInputDTO[]> {
    return this.readFile(this.filteredPath);
  }
  async clearFile(): Promise<void> {
    fs.writeFile(this.filteredPath, '', (err) => {
      if (err) {
        console.error(err);
        throw err;
      }
      console.info('File cleaned');
    });
  }

  private async readFile(path: string): Promise<LitInputDTO[]> {
    const result: LitInputDTO[] = [];
    const fileStream = fs.createReadStream(path);
    let litsReaded = 0;
    let tempLit = this.resetLit();
    let strategy = '';

    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Number.POSITIVE_INFINITY, 
      });
  
      rl.on('line', (line) => {
        if (line.includes('Correo: De:')) {
          strategy = this.selectStrategy(line);
          tempLit.company = strategy;
        }
  
        if (strategy) {
          this.matchStrategy(strategy, tempLit, line);
        }
  
        if (line.includes('Content-Type: text/html; charset="UTF-8"')) {
          strategy = '';
          this.checkLitToSave(result, tempLit);
          litsReaded++;
          tempLit = this.resetLit();
        }
      });

      rl.on('close', () => {
        console.info(`
          =====================================
           Archivo leído completamente.      
           Litts creados: ${result.length}   
           Litts leidos: ${litsReaded}       
           Litts faltantes: ${litsReaded - result.length}
          =====================================
          `);
          resolve(result)
      });
      rl.on('error', (error) => {
        console.error('Error al leer el archivo:', error);
        reject(error);
      });
    })

    
  }

  private checkLitToSave(lits: LitInputDTO[], litInput: LitInputDTO): void {
    if (!this.invalidLit(litInput)) {
      try {
        const validateLit = validateLitInput(litInput);
        lits.push(validateLit);
      } catch (err) {
        console.info(`Error to load Lit from filtered file: \n${litInput}`);
      }
    }
  }

  private invalidLit(lit: LitInputDTO): boolean {
    return (
      lit.client === 'Anonimo' && lit.company === 'Desconocido' && lit.estateName === 'Desconocido'
    );
  }

  private matchStrategy(strategy: string, litInput: LitInputDTO, line: string): void {
    switch (strategy) {
      case Strategy.ciencuadras:
        this.ciencuadrasStrategy(litInput, line);
        break;
      case Strategy.fincaraiz:
        this.fincaraizStrategy(litInput, line);
        break;
      case Strategy.metrocuadrado:
        this.metrocuadradoStrategy(litInput, line);
        break;
      case Strategy.proppit:
        this.proppitStrategy(litInput, line);
        break;
      default:
        break;
    }
  }

  private ciencuadrasStrategy(litInput: LitInputDTO, line: string): void {
    if (line.includes('Código:')) {
      const regex = /-(\d+)/;
      const mapped = line.match(regex);
      const estateCode = mapped ? (mapped[1] ? mapped[1] : '') : '';
      litInput.estateId = estateCode;
    }

    if (line.includes('Nombre:')) {
      const regex = /\*Nombre:\*\s*(.*)/;
      const mapped = line.match(regex);
      const clienName = mapped ? (mapped[1] ? mapped[1] : 'Anonimo') : 'Anonimo';
      litInput.client = clienName;
    }

    if (line.includes('Celular:')) {
      const regex = /\*Celular:\*\s*(.*)/;
      const mapped = line.match(regex);
      const clientPhone = mapped ? (mapped[1] ? mapped[1] : '') : '';
      litInput.phone = clientPhone;
    }

    if (line.includes('Email:')) {
      const regex = /\*Email:\*\s*(.*)/;
      const mapped = line.match(regex);
      const clienEmail = mapped ? (mapped[1] ? mapped[1] : '') : '';
      litInput.email = clienEmail;
    }

    if (
      (line.includes('Arriendo') || line.includes('Venta')) &&
      litInput.estateName === 'Desconocido'
    ) {
      this.checkEstateName(litInput, line);
    }
  }

  private fincaraizStrategy(litInput: LitInputDTO, line: string): void {
    if (line.includes('Subject:')) {
      const regex = /(\d+)$/;
      const mapped = line.match(regex);
      const estateCode = mapped ? (mapped[1] ? mapped[1] : '') : '';
      litInput.estateId = estateCode;
    }

    if (line.includes('@') && !line.includes('Correo: De:')) {
      litInput.email = line;
    }

    if (line.includes('nombre')) {
      const regex = /\*([^\*]+)\*/;
      const mapped = line.match(regex);
      const clienName = mapped ? (mapped[1] ? mapped[1] : 'Anonimo') : 'Anonimo';
      litInput.client = clienName;
    }

    if (line.includes('un nuevo cliente se ha interesado en tu inmueble')) {
      const regex = /\*(.*)$/;
      const mapped = line.match(regex);
      const estateName = mapped ? (mapped[1] ? mapped[1] : 'Desconocido') : 'Desconocido';
      litInput.estateName = estateName;
    }

    if (litInput.estateName !== 'Desconocido' && line.includes('número de referencia')) {
      const regex = /^(.*?)\*/;
      const mapped = line.match(regex);
      const estateName = mapped ? (mapped[1] ? mapped[1] : '') : '';
      litInput.estateName += estateName;
    }

    if (line.includes('LLama al cliente')) {
      const regex = /(\+?\d{1,3})?(\d{10,15})/;
      const mapped = line.match(regex);
      const phone = mapped ? (mapped[0] ? mapped[0] : '') : '';
      litInput.phone = phone;
    }
  }

  private metrocuadradoStrategy(litInput: LitInputDTO, line: string): void {
    if (
      litInput.estateName === 'Desconocido' &&
      (line.includes('Venta') || line.includes('Arriendo'))
    ) {
      litInput.estateName = line;
    }

    if (line.includes('Nombre:')) {
      const regex = /\*([^\*]+)\*/;
      const mapped = line.match(regex);
      const name = mapped ? (mapped[1] ? mapped[1] : 'Anonimo') : 'Anonimo';
      litInput.client = name;
    }

    if (line.includes('Teléfono:')) {
      const regex = /\*([^\*]+)\*/;
      const mapped = line.match(regex);
      const phone = mapped ? (mapped[1] ? mapped[1] : '') : '';
      litInput.phone = phone;
    }

    if (line.includes('https://www.metrocuadrado.com')) {
      litInput.estateId = line;
    }
  }

  private proppitStrategy(litInput: LitInputDTO, line: string): void {
    if (
      litInput.estateName !== 'Propiedad de interés' &&
      litInput.estateName !== 'Desconocido' &&
      !litInput.estateId
    ) {
      litInput.estateId = line;
    }

    if (litInput.estateName === 'Propiedad de interés') {
      litInput.estateName = line;
    }

    if (line.includes('@') && !line.includes('Correo: De:') && !line.includes('proppit')) {
      litInput.email = line.split(' ')[0];
    }

    if (line.includes('Teléfono verificado')) {
      litInput.phone = line.split(' ')[0];
    }

    if (line.includes('Propiedad de interés')) {
      litInput.estateName = 'Propiedad de interés';
    }
  }

  private selectStrategy(line: string): string {
    const regex = /<([^@]+)@([a-zA-Z0-9.-]+)>/;
    const match = line.match(regex);
    const domain = match ? match[2] : '';
    switch (domain) {
      case 'ciencuadras.com':
        return Strategy.ciencuadras;
      case 'fincaraiz.com.co':
        return Strategy.fincaraiz;
      case 'proppit.com':
        return Strategy.proppit;
      case 'metrocuadrado.com':
        return Strategy.metrocuadrado;
      default:
        return '';
    }
  }

  private checkEstateName(lit: LitInputDTO, line: string): void {
    const possibleNames = [
      'Apartamento',
      'Casa campestre',
      'Apartaestudio',
      'Edificio',
      'Oficina',
      'Local',
      'Consultorio',
      'Lote',
      'Bodega',
      'Finca',
      'Parqueadero',
      'Depósito',
      'Suite',
      'Casa',
    ];
    for (const word in possibleNames) {
      if (possibleNames[word] && line.includes(possibleNames[word])) {
        lit.estateName = possibleNames[word];
        break;
      }
    }
  }

  private resetLit(): LitInputDTO {
    return {
      client: 'Anonimo',
      company: 'Desconocido',
      estateName: 'Desconocido',
    };
  }

  private async singletonFile():Promise<void>{
    try {
      await promises.access(this.filteredPath);
      console.log(`The file ${this.filteredPath} already exists.`);
  } catch (error) {
      await promises.writeFile(this.filteredPath, '');
      console.log(`File ${this.filteredPath} created.`);
    }
  }
}

enum Strategy {
  fincaraiz = 'FINCARAIZ',
  metrocuadrado = 'METRO CUADRADO',
  proppit = 'PROPPIT',
  ciencuadras = 'CIEN CUADRAS',
}