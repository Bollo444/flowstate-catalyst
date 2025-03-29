export const Slider: React.FC<SliderProps> = ({ min, max, value }) => {
  return (
    <div className="slider-container">
      <SliderTrack min={min} max={max} />
      <SliderHandle value={value} />
      <SliderMarkers />
    </div>
  );
};
