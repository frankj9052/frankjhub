import { IssueInvitationRequest, issueInvitationRequestSchema } from '@frankjhub/shared-schema';
import { FrankForm } from '@frankjhub/shared-ui-hero-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';

type Props = {
  onClose: () => void;
};

export const IssueInvitationForm = ({ onClose }: Props) => {
  const { handleSubmit } = useForm<IssueInvitationRequest>({
    resolver: zodResolver(issueInvitationRequestSchema),
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit(async data => {
    console.log('submit ===> ', data);
  });
  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Top */}
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Issue Invitation</h1>
        <IoMdClose size={20} className="cursor-pointer" onClick={onClose} />
      </div>

      <h2 className="text-gray-400 text-xs">Invite organization join the platform</h2>

      {/* Form */}
      <FrankForm onSubmit={onSubmit}>
        <div className="flex flex-col w-full"></div>
      </FrankForm>
    </div>
  );
};
