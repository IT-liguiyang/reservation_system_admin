import React from 'react';

import NumberInfo from './number_info';
import SchoolDistributionSystemAdmin from './school_distribution_systemadmin';
import SchoolDistributionSchoolAdmin from './school_distribution_schooladmin';
import ReservationInfoSchoolAdmin from './reservation_info_schooladmin';
import ReservationInfoSystemAdmin from './reservation_info_systemadmin';
import storageUtils from '../../utils/storageUtils';

const Welcome = () => {

  const role_id = storageUtils.getAdmin().role_id;
  console.log('role_id', role_id);
  return (
    <div>
      <NumberInfo />
      {
        role_id === '1'? <SchoolDistributionSystemAdmin /> : <SchoolDistributionSchoolAdmin />
      }
      {
        role_id === '1'? <ReservationInfoSystemAdmin /> : <ReservationInfoSchoolAdmin />
      }
    </div>
  );
};

export default Welcome;
