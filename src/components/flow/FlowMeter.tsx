export const FlowMeter: React.FC<FlowMeterProps> = ({ level }) => {
  const meterStyle = calculateMeterStyle(level);

  return (
    <div className="flow-meter">
      <MeterGauge level={level} style={meterStyle} />
      <MeterLabels />
      <MeterControls />
    </div>
  );
};
