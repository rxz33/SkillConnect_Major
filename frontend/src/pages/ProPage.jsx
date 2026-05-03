import React from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../config';
import Breadcrums from '../Components/Breadcrums/Breadcrums';
import ProPageDisplay from '../Components/ProPageDisplay/ProPageDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedServices from '../Components/RelatedServices/RelatedServices';

const ProPage = () => {
  const { propageId } = useParams();
  const [profile, setProfile] = React.useState(null);

  React.useEffect(() => {
    fetch(`${BASE_URL}/propage/${propageId}`)
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, [propageId]);

  if (!profile) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading profile...</div>;
  }

  return (
    <div>
      <Breadcrums profile={profile} />
      <ProPageDisplay profile={profile} />
      <DescriptionBox/>
      <RelatedServices/>
    </div>
  );
};

export default ProPage;
