export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <div className={`modal ${isOpen ? "visible" : "hidden"}`}>
      <ModalHeader title={title} onClose={onClose} />
      <ModalContent>{children}</ModalContent>
      <ModalFooter />
    </div>
  );
};
