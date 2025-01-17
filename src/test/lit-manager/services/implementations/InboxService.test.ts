import fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InboxServiceImpl } from '../../../../modules/lit-manager/services/implementations/inbox-impl.js';

// Mock fs module
vi.mock('node:fs', () => ({
  default: {
    createReadStream: vi.fn(),
    writeFile: vi.fn(),
  },
  promises: {
    access: vi.fn(),
    writeFile: vi.fn(),
  },
}));

// Mock readline module
vi.mock('node:readline', () => ({
  default: {
    createInterface: vi.fn(() => ({
      on: vi.fn((event, callback) => {
        if (mockFileContent && event === 'line') {
          mockFileContent.split('\n').forEach(callback);
        }
        if (event === 'close') {
          callback();
        }
      }),
    })),
  },
}));

// Mock data
let mockFileContent: string;
const TEST_FILE_PATH = 'test-filtered-path.txt';

describe('InboxServiceImpl', () => {
  let inboxService: InboxServiceImpl;

  beforeEach(() => {
    vi.clearAllMocks();
    inboxService = new InboxServiceImpl(TEST_FILE_PATH);
  });

  describe('clearFile', () => {
    it('should clear the file content', async () => {
      const writeFileMock = vi.spyOn(fs, 'writeFile');

      await inboxService.clearFile();

      expect(writeFileMock).toHaveBeenCalledWith(TEST_FILE_PATH, '', expect.any(Function));
    });
  });

  describe('getFilteredEmails', () => {
    it('should parse Ciencuadras email correctly', async () => {
      mockFileContent = `
Correo: De: <test@ciencuadras.com>
Código: -123456
*Nombre:* John Doe
*Celular:* 1234567890
*Email:* john@example.com
Apartamento en Arriendo
Content-Type: text/html; charset="UTF-8"
      `.trim();

      const result = await inboxService.getFilteredEmails();

      expect(result).toEqual([
        {
          client: 'John Doe',
          company: 'CIEN CUADRAS',
          estateName: 'Apartamento',
          estateId: '123456',
          phone: '1234567890',
          email: 'john@example.com',
        },
      ]);
    });

    it('should parse Fincaraiz email correctly', async () => {
      mockFileContent = `
Correo: De: <test@fincaraiz.com.co>
Subject: Nuevo Lead 123456
cliente@email.com
nombre *Juan Cliente*
un nuevo cliente se ha interesado en tu inmueble *Apartamento en Venta -
Bogotá - Lugar *, con número de referencia * 888
LLama al cliente 3211234567
Content-Type: text/html; charset="UTF-8"
      `.trim();

      const result = await inboxService.getFilteredEmails();

      expect(result).toEqual([
        {
          client: 'Juan Cliente',
          company: 'FINCARAIZ',
          estateName: 'Apartamento en Venta -Bogotá - Lugar ',
          estateId: '123456',
          phone: '3211234567',
          email: 'cliente@email.com',
        },
      ]);
    });

    it('should parse Metrocuadrado email correctly', async () => {
      mockFileContent = `
Correo: De: <test@metrocuadrado.com>
Casa en Venta
Nombre: *Jane Doe*
Teléfono: *9876543210*
https://www.metrocuadrado.com/inmueble/789012
Content-Type: text/html; charset="UTF-8"
      `.trim();

      const result = await inboxService.getFilteredEmails();

      expect(result).toEqual([
        {
          client: 'Jane Doe',
          company: 'METRO CUADRADO',
          estateName: 'Casa en Venta',
          estateId: 'https://www.metrocuadrado.com/inmueble/789012',
          phone: '9876543210',
        },
      ]);
    });

    it('should parse Proppit email correctly', async () => {
      mockFileContent = `
Correo: De: <test@proppit.com>
Propiedad de interés
Casa en Venta Centro
ABC789
cliente@email.com
3009876543 Teléfono verificado
Content-Type: text/html; charset="UTF-8"
      `.trim();

      const result = await inboxService.getFilteredEmails();

      expect(result).toEqual([
        {
          client: 'Anonimo',
          company: 'PROPPIT',
          estateName: 'Casa en Venta Centro',
          estateId: 'ABC789',
          phone: '3009876543',
          email: 'cliente@email.com',
        },
      ]);
    });

    it('should skip invalid leads', async () => {
      mockFileContent = `
Correo: De: <test@unknown.com>
Some content
Content-Type: text/html; charset="UTF-8"
      `.trim();

      const result = await inboxService.getFilteredEmails();

      expect(result).toEqual([]);
    });
  });
});
