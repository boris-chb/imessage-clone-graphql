import { Skeleton } from '@chakra-ui/react';

interface SkeletonLoaderProps {
  count: number;
  height: string;
  width?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count, height }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Skeleton
          key={i}
          height={height}
          width={{ base: 'full' }}
          startColor="blackAlpha.400"
          endColor="whiteAlpha.300"
          borderRadius={4}
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
