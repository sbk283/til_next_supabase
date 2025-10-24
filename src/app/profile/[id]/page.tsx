interface ProfileDetailProps {
  params: {
    id: string;
  };
}

function ProfileDetail({ params }: ProfileDetailProps) {
  const id = params.id;
  return <div>ProfileDetail {id}</div>;
}

export default ProfileDetail;
