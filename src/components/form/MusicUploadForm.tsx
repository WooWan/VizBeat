import React, { useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MusicUpload } from '@/types/music';
import { useSeparateMusic } from '@/hooks/queries/music/useMusics';
import { musicUploadSchema } from '@/schema';
import { Loader2Icon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type Props = {
  selectedTrack?: MusicUpload;
};

export default function MusicUploadForm({ selectedTrack }: Props) {
  const separateMusicWithFile = useSeparateMusic();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof musicUploadSchema>>({
    resolver: zodResolver(musicUploadSchema),
    defaultValues: {
      title: '',
      artist: ''
    }
  });

  useEffect(() => {
    if (!selectedTrack) return;
    form.setValue('title', selectedTrack.title, {
      shouldDirty: true
    });
    form.setValue('artist', selectedTrack.artist);
  }, [selectedTrack, form]);

  const onSubmit = async (data: z.infer<typeof musicUploadSchema>) => {
    if (!selectedTrack) return;

    const uploadedMusic = {
      ...selectedTrack,
      title: data.title,
      artist: data.artist
    };
    separateMusicWithFile.mutate(uploadedMusic, {
      onSuccess: () => {
        toast({
          description: 'Successfully uploaded music'
        });
      },
      onError: () => {
        toast({
          description: 'Failed to upload music'
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('hidden pt-3', {
          block: selectedTrack
        })}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Music</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="artist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Artist</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <footer className="flex justify-end pt-4">
          <Button className="relative" disabled={separateMusicWithFile.isLoading} type="submit">
            <p>Split Music</p>
            {separateMusicWithFile.isLoading && <Loader2Icon className="ml-1.5 h-4 w-4 animate-spin" />}
          </Button>
        </footer>
      </form>
    </Form>
  );
}
