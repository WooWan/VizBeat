import React, { useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isUploadWithFile, isUploadWithSpotify } from '@/utils/typeGuards';
import { MusicUpload } from '@/types/spotify';
import { useSeparateMusic } from '@/hooks/queries/music/useMusics';
import { httpClient } from '@/service/httpClient';
import { musicUploadSchema } from '@/schema';
import { useMutation } from '@tanstack/react-query';

type Props = {
  selectedTrack?: MusicUpload;
};

export default function MusicUploadForm({ selectedTrack }: Props) {
  const separateMusicWithFile = useSeparateMusic();
  const separateMusicWithUrl = useMutation({
    mutationFn: (track: MusicUpload) => httpClient.post('/music', track)
  });
  const form = useForm<z.infer<typeof musicUploadSchema>>({
    resolver: zodResolver(musicUploadSchema),
    defaultValues: {
      title: '',
      artist: ''
    }
  });

  useEffect(() => {
    if (!selectedTrack) return;
    form.setValue('title', selectedTrack?.title, {
      shouldDirty: true
    });
    form.setValue('artist', selectedTrack?.artist);
  }, [selectedTrack]);

  const onSubmit = async (data: z.infer<typeof musicUploadSchema>) => {
    if (!selectedTrack) return;

    if (isUploadWithFile(selectedTrack)) {
      const formData = new FormData();
      formData.append('audio', selectedTrack.audioFile);
      formData.append('albumCover', selectedTrack?.albumCover);
      formData.append('title', data.title);
      formData.append('artist', data.artist);

      separateMusicWithFile.mutate(formData);
    } else if (isUploadWithSpotify(selectedTrack)) {
      separateMusicWithUrl.mutate(selectedTrack);
    }
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
          <Button type="submit">Submit</Button>
        </footer>
      </form>
    </Form>
  );
}
