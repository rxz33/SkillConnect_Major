import React, { useContext } from 'react';
import {Context } from '../Context/Context';
import { useParams } from 'react-router-dom';
import Breadcrums from '../Components/Breadcrums/Breadcrums';
import ProPageDisplay from '../Components/ProPageDisplay/ProPageDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedServices from '../Components/RelatedServices/RelatedServices';
const ProPage = () => {
  const {all_profile} = useContext(Context);
  const { propageId } = useParams();
  const profile = all_profile.find((e) => e.id === propageId);

   console.log("all_profile:", all_profile);
  console.log("propageId:", propageId);
  if (!profile) {
    return <div>Loading profile...</div>;
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
