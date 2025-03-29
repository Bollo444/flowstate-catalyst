export const DateTimePicker: React.FC<DateTimeProps> = ({ value, format }) => {
  return (
    <div className="datetime-container">
      <DatePicker value={value} />
      <TimePicker format={format} />
      <DateTimeControls />
    </div>
  );
};
