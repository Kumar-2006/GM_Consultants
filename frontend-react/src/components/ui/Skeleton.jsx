const Skeleton = ({ lines = 3, height = 12 }) => (
  <div className="skeleton">
    {Array.from({ length: lines }).map((_, index) => (
      <span
        key={index}
        className="skeleton__line"
        style={{ height: index === 0 ? height + 4 : height, width: `${100 - index * 8}%` }}
      />
    ))}
  </div>
);

export default Skeleton;
