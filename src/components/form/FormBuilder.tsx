export const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  onSubmit,
  validation,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormFields fields={fields} />
      <FormValidation rules={validation} />
      <FormActions />
    </form>
  );
};
