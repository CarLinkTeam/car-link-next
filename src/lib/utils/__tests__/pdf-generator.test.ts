import { PDFGenerator, formatCurrency, formatDate, formatDateRange } from '../pdf-generator'

// Mock de jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    text: jest.fn(),
    splitTextToSize: jest.fn((text) => [text]),
    setFillColor: jest.fn(),
    rect: jest.fn(),
    setDrawColor: jest.fn(),
    line: jest.fn(),
    internal: {
      pageSize: {
        getHeight: jest.fn(() => 297),
        getWidth: jest.fn(() => 210),
      },
      getNumberOfPages: jest.fn(() => 1),
    },
    setPage: jest.fn(),
    setTextColor: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
    addImage: jest.fn(),
  }))
})

// Mock de html2canvas
jest.mock('html2canvas', () => {
  return jest.fn().mockResolvedValue({
    toDataURL: jest.fn(() => 'data:image/png;base64,mockdata'),
    width: 800,
    height: 600,
  })
})

describe('PDFGenerator', () => {
  let pdfGenerator: PDFGenerator

  beforeEach(() => {
    jest.clearAllMocks()
    pdfGenerator = new PDFGenerator()
  })

  describe('constructor', () => {
    it('debe crear una instancia con configuración por defecto', () => {
      expect(pdfGenerator).toBeInstanceOf(PDFGenerator)
    })

    it('debe crear una instancia con opciones personalizadas', () => {
      const options = {
        margin: 30,
        orientation: 'landscape' as const,
        format: 'letter' as const,
      }
      const customPDF = new PDFGenerator(options)
      expect(customPDF).toBeInstanceOf(PDFGenerator)
    })
  })

  describe('addTitle', () => {
    it('debe agregar un título al PDF', () => {
      const title = 'Reporte de Prueba'
      pdfGenerator.addTitle(title)

      expect(pdfGenerator['pdf'].setFontSize).toHaveBeenCalledWith(20)
      expect(pdfGenerator['pdf'].setFont).toHaveBeenCalledWith('helvetica', 'bold')
      expect(pdfGenerator['pdf'].text).toHaveBeenCalledWith(title, 20, 30)
    })
  })

  describe('addSubtitle', () => {
    it('debe agregar un subtítulo y retornar nueva posición', () => {
      const subtitle = 'Subtítulo de prueba'
      const yPosition = 50

      const newPosition = pdfGenerator.addSubtitle(subtitle, yPosition)

      expect(pdfGenerator['pdf'].setFontSize).toHaveBeenCalledWith(14)
      expect(pdfGenerator['pdf'].setFont).toHaveBeenCalledWith('helvetica', 'normal')
      expect(pdfGenerator['pdf'].text).toHaveBeenCalledWith(subtitle, 20, yPosition)
      expect(newPosition).toBe(60)
    })
  })

  describe('addText', () => {
    it('debe agregar texto normal y retornar nueva posición', () => {
      const text = 'Texto de prueba'
      const yPosition = 70

      const newPosition = pdfGenerator.addText(text, yPosition)

      expect(pdfGenerator['pdf'].setFontSize).toHaveBeenCalledWith(12)
      expect(pdfGenerator['pdf'].setFont).toHaveBeenCalledWith('helvetica', 'normal')
      expect(newPosition).toBe(75)
    })

    it('debe agregar texto con opciones personalizadas', () => {
      const text = 'Texto en negrita'
      const yPosition = 70
      const options = { bold: true, size: 16 }

      pdfGenerator.addText(text, yPosition, options)

      expect(pdfGenerator['pdf'].setFontSize).toHaveBeenCalledWith(16)
      expect(pdfGenerator['pdf'].setFont).toHaveBeenCalledWith('helvetica', 'bold')
    })
  })

  describe('addTable', () => {
    it('debe agregar una tabla y retornar nueva posición', () => {
      const headers = ['Columna 1', 'Columna 2']
      const rows = [
        ['Dato 1', 'Dato 2'],
        ['Dato 3', 'Dato 4'],
      ]
      const yPosition = 80

      const newPosition = pdfGenerator.addTable(headers, rows, yPosition)

      expect(pdfGenerator['pdf'].setFillColor).toHaveBeenCalledWith(240, 240, 240)
      expect(pdfGenerator['pdf'].rect).toHaveBeenCalled()
      expect(newPosition).toBeGreaterThan(yPosition)
    })
  })

  describe('addSeparator', () => {
    it('debe agregar una línea separadora y retornar nueva posición', () => {
      const yPosition = 100

      const newPosition = pdfGenerator.addSeparator(yPosition)

      expect(pdfGenerator['pdf'].setDrawColor).toHaveBeenCalledWith(200, 200, 200)
      expect(pdfGenerator['pdf'].line).toHaveBeenCalled()
      expect(newPosition).toBe(110)
    })
  })

  describe('addFooter', () => {
    it('debe agregar footer con fecha y número de página', () => {
      pdfGenerator.addFooter()

      expect(pdfGenerator['pdf'].setFontSize).toHaveBeenCalledWith(8)
      expect(pdfGenerator['pdf'].setFont).toHaveBeenCalledWith('helvetica', 'normal')
      expect(pdfGenerator['pdf'].setTextColor).toHaveBeenCalledWith(128, 128, 128)
    })
  })

  describe('download', () => {
    it('debe descargar el PDF con el nombre especificado', () => {
      const filename = 'test-report.pdf'

      pdfGenerator.download(filename)

      expect(pdfGenerator['pdf'].save).toHaveBeenCalledWith(filename)
    })
  })

  describe('fromElement (método estático)', () => {
    it('debe generar PDF desde elemento HTML', async () => {
      const mockElement = document.createElement('div')
      const options = {
        filename: 'from-element.pdf',
        title: 'Test PDF',
      }

      await PDFGenerator.fromElement(mockElement, options)

      // Se verifica que html2canvas fue llamado
      const html2canvas = await import('html2canvas')
      expect(html2canvas.default).toHaveBeenCalledWith(mockElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })
    })
  })
})

describe('Utilidades de formato', () => {
  describe('formatCurrency', () => {
    it('debe formatear número como moneda colombiana', () => {
      const result = formatCurrency(250000)
      expect(result).toContain('250.000')
    })

    it('debe formatear string como moneda', () => {
      const result = formatCurrency('300000')
      expect(result).toContain('300.000')
    })

    it('debe manejar decimales', () => {
      const result = formatCurrency(250000.5)
      expect(result).toContain('250.000')
    })
  })

  describe('formatDate', () => {
    it('debe formatear fecha como string', () => {
      const result = formatDate('2024-01-15')
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
    })

    it('debe formatear objeto Date', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
    })
  })

  describe('formatDateRange', () => {
    it('debe formatear rango de fechas', () => {
      const startDate = '2024-01-10'
      const endDate = '2024-01-15'
      const result = formatDateRange(startDate, endDate)

      expect(result).toContain(' - ')
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4} - \d{1,2}\/\d{1,2}\/\d{4}/)
    })

    it('debe formatear rango con objetos Date', () => {
      const startDate = new Date('2024-01-10')
      const endDate = new Date('2024-01-15')
      const result = formatDateRange(startDate, endDate)

      expect(result).toContain(' - ')
    })
  })
})
