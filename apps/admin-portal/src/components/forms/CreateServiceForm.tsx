'use client';

import { IoMdClose } from 'react-icons/io';
import { CreateServiceForm as CreateServiceFormTemplate } from '@frankjhub/shared-ui-hero-client';
import { getPermissionOptionsAsync, useDispatch, useSelector } from '@/libs/redux';
import { useEffect } from 'react';
type Props = {
  onClose: () => void;
};

export const CreateServiceForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();
  const permissionOptionList = useSelector(state => state.permission.options?.data);
  // get permission option list
  useEffect(() => {
    dispatch(getPermissionOptionsAsync());
  }, [dispatch]);
  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Top */}
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Create Service</h1>
        <IoMdClose size={20} className="cursor-pointer" onClick={onClose} />
      </div>

      <h2 className="text-gray-400 text-xs">
        Please fill out the form — fields marked with an asterisk (*) are required.
      </h2>

      {/* form */}
      <CreateServiceFormTemplate
        onSubmit={values => {
          console.log('submit values ===> ', values);
        }}
        permissionOptionList={permissionOptionList}
      />
    </div>
  );
};
