export const Rating: React.FC<RatingProps> = ({ value, max, onChange }) => {
  return (
    <div className="rating-container">
      <RatingStars value={value} max={max} />
      <RatingFeedback />
      <RatingControls onChange={onChange} />
    </div>
  );
};
