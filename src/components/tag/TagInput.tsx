export const TagInput: React.FC<TagProps> = ({ tags, suggestions }) => {
  return (
    <div className="tag-container">
      <TagList tags={tags} />
      <TagSuggestions suggestions={suggestions} />
      <TagEditor />
    </div>
  );
};
