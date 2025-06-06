import { Skeleton } from './ui/Skeleton';

const MessageSkeleton = () => {
  return (
    <div className='space-y-4 p-4'>
      {/* Incoming message skeleton */}
      <div className='flex items-start gap-3'>
        <Skeleton className='h-8 w-8 rounded-full' />
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-3 w-12' />
          </div>
          <div className='rounded-lg bg-muted p-3 max-w-xs'>
            <Skeleton className='h-3 w-32 mb-2' />
            <Skeleton className='h-3 w-24' />
          </div>
        </div>
      </div>

      {/* Outgoing message skeleton */}
      <div className='flex items-start gap-3 justify-end'>
        <div className='flex flex-col gap-2 items-end'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-3 w-12' />
            <Skeleton className='h-4 w-16' />
          </div>
          <div className='rounded-lg bg-primary p-3 max-w-xs'>
            <Skeleton className='h-3 w-28 mb-2' />
            <Skeleton className='h-3 w-20' />
          </div>
        </div>
        <Skeleton className='h-8 w-8 rounded-full' />
      </div>

      {/* Incoming message skeleton */}
      <div className='flex items-start gap-3'>
        <Skeleton className='h-8 w-8 rounded-full' />
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-3 w-12' />
          </div>
          <div className='rounded-lg bg-muted p-3 max-w-xs'>
            <Skeleton className='h-3 w-40 mb-2' />
            <Skeleton className='h-3 w-32 mb-2' />
            <Skeleton className='h-3 w-28' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
