import { useTheme } from '@/hooks/use-theme'
import { CommunityPost } from '@/models/communityPost'
import { dimensions } from '@/utils/app-helper'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useEffect, useState } from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import ThemeText from '../../text/ThemeText'

const { width, height } = dimensions

export const ReelItem = ({ post, isVisible }: { post: CommunityPost, isVisible: boolean }) => {
  const theme = useTheme()
  const [muted, setMuted] = useState(false)
  const allMedia = [...(post?.image_url || []), ...(post?.video_link || [])]
  const firstVideo = post?.video_link?.[0]

  // expo-video player
  const player = useVideoPlayer(firstVideo || '', (player) => {
    player.loop = true
    player.muted = false
  })

  useEffect(() => {
    if (!firstVideo) return
    if (isVisible) {
      player.play()
    } else {
      player.pause()
    }
  }, [isVisible, firstVideo])

  useEffect(() => {
    player.muted = muted
  }, [muted])

  return (
    <View style={{ width, height: height - 100, backgroundColor: '#000' }}>
      {/* Media Layer */}
      {firstVideo ? (
        <Pressable onPress={() => setMuted(v => !v)} style={{ flex: 1 }}>
          <VideoView
            player={player}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            nativeControls={false}
          />
        </Pressable>
      ) : (
        <Image
          source={{ uri: post?.image_url?.[0] }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      )}

      {/* Gradient Overlay + Info - Like Instagram */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          paddingBottom: 30,
          gap: 8,
          backgroundColor: 'rgba(0,0,0,0.25)'
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Image
            source={{ uri: post?.image_url?.[0] }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
          />
          <ThemeText content={post?.name || 'community'} fontFamily='MontserratBold' variant='sm' style={{ color: 'white' }} />
        </View>

        <ThemeText
          content={post?.title}
          fontFamily='MontserratBold'
          style={{ color: 'white' }}
        />
        <Text numberOfLines={2} style={{ color: 'white', fontFamily: 'Montserrat', opacity: 0.9 }}>
          {post?.description}
        </Text>
      </View>

      {/* Right Actions - Like, Comment, Share */}
      <View style={{ position: 'absolute', right: 12, bottom: 120, gap: 24, alignItems: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 28, color: 'white' }}>♡</Text>
          <Text style={{ color: 'white', fontSize: 12 }}>1.2k</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 28, color: 'white' }}>💬</Text>
          <Text style={{ color: 'white', fontSize: 12 }}>{allMedia.length}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 28, color: 'white' }}>↗</Text>
        </View>
      </View>
    </View>
  )
}