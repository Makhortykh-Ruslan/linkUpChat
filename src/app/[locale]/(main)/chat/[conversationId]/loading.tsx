import { Loader } from '@core/components/Loader/Loader';

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader size="large" />
    </div>
  );
}
