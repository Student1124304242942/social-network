import HomiesProfile from '@/components/HomiesProfile/HomiesProfile';
import { Api } from '@/firebase';

export async function generateStaticParams() {
  const profiles = await Api.getProfiles();
  if (!profiles) {
    return [];
  }
  return profiles.map((profile) => ({
    userProfile: profile.id,
  }));
}


const Page = async ({ params }: { params: { userProfile: string } }) => {
  const id = params.userProfile as string;
  const userData = await Api.getAnotherProfile(id);
  if (!userData || userData.length === 0) {
    return {
      notFound: true,
    };
  }

  return (
    userData.map(user => (
        <HomiesProfile
        key={user.id}
        name={user.name}
        avatar={user.avatar}
        age={user.age}
        skills={user.skills}
        country={user.country}
        profileImage={user.profileImage}
        posts={user.posts}
      />
    ))
  );
}

export default Page;
 