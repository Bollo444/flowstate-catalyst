export const ImageGallery: React.FC<GalleryProps> = ({ images, layout }) => {
  return (
    <div className="gallery-container">
      <GalleryGrid images={images} />
      <GalleryPreview />
      <GalleryControls layout={layout} />
    </div>
  );
};
