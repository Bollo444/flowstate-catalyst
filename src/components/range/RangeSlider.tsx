export const RangeSlider: React.FC<RangeProps> = ({ min, max, values }) => {
  return (
    <div className="range-container">
      <RangeTrack min={min} max={max} />
      <RangeHandles values={values} />
      <RangeLabels />
    </div>
  );
};
