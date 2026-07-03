const ExcelJS = require('exceljs');

// Builds an .xlsx workbook (in memory) listing every completed attempt.
// Returns a Buffer ready to be sent as an HTTP response.
async function buildResultsWorkbook(attempts, settings) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Plateforme Examen Data Science';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Résultats');

  sheet.mergeCells('A1:F1');
  sheet.getCell('A1').value = settings.university;
  sheet.getCell('A1').font = { bold: true, size: 14 };
  sheet.getCell('A1').alignment = { horizontal: 'center' };

  sheet.mergeCells('A2:F2');
  sheet.getCell('A2').value = `${settings.faculty} - ${settings.degree}`;
  sheet.getCell('A2').font = { bold: true, size: 12 };
  sheet.getCell('A2').alignment = { horizontal: 'center' };

  sheet.mergeCells('A3:F3');
  sheet.getCell('A3').value = `${settings.title} - Résultats des étudiants`;
  sheet.getCell('A3').font = { italic: true, size: 11 };
  sheet.getCell('A3').alignment = { horizontal: 'center' };

  sheet.addRow([]);

  const headerRow = sheet.addRow([
    'Nom',
    'Prénom',
    'CNE',
    `Note / ${settings.totalQuestions}`,
    'Statut',
    'Date de passage',
  ]);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E3A5F' },
    };
    cell.alignment = { horizontal: 'center' };
  });

  attempts.forEach((attempt) => {
    const passed = attempt.score >= attempt.passingScore;
    const row = sheet.addRow([
      attempt.nom,
      attempt.prenom,
      attempt.cne,
      attempt.status === 'completed' ? attempt.score : 'En cours',
      attempt.status !== 'completed' ? 'En cours' : passed ? 'Réussi' : 'Échoué',
      attempt.completedAt
        ? new Date(attempt.completedAt).toLocaleString('fr-FR')
        : new Date(attempt.startedAt).toLocaleString('fr-FR'),
    ]);

    if (attempt.status === 'completed') {
      const statusCell = row.getCell(5);
      statusCell.font = {
        bold: true,
        color: { argb: passed ? 'FF1B7A3D' : 'FFB00020' },
      };
    }
  });

  sheet.columns = [
    { width: 20 },
    { width: 20 },
    { width: 18 },
    { width: 14 },
    { width: 14 },
    { width: 22 },
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

module.exports = { buildResultsWorkbook };
