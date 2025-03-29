export const RichTextEditor: React.FC<EditorProps> = ({
  content,
  toolbar,
  onChange,
}) => {
  return (
    <div className="editor-container">
      <EditorToolbar tools={toolbar} />
      <EditorContent content={content} />
      <EditorControls onChange={onChange} />
    </div>
  );
};
