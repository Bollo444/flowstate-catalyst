export const Spreadsheet: React.FC<SpreadsheetProps> = ({ data, formulas }) => {
  return (
    <div className="spreadsheet-container">
      <SpreadsheetGrid data={data} />
      <FormulaBar formulas={formulas} />
      <CellEditor />
    </div>
  );
};
