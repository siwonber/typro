import TyproLayout from '@/app/typro-layout'
import ProfileHeader from '@/app/profile/ProfileHeader'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <TyproLayout>
      <ProfileHeader />
      <div className="p-6">{children}</div>
    </TyproLayout>
  )
}
