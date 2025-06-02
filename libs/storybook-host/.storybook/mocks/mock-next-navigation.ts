export const useRouter = () => ({
  push: () => {
    console.log('push');
  },
  back: () => {
    console.log('back');
  },
  refresh: () => {
    console.log('refresh');
  },
});

export const usePathname = () => '/storybook-mocked-pathname';

export const useSearchParams = () => new URLSearchParams();
