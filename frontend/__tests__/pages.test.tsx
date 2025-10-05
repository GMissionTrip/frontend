import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';
import useUser from '@/hooks/useUser';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/ToastProvider', () => ({
  useToast: jest.fn(),
}));

jest.mock('@/hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/services/archiveService', () => ({
  archiveService: {
    getArchives: jest.fn(),
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock React Icons
jest.mock('react-icons/fa', () => ({
  FaBars: () => <div data-testid="fa-bars" />,
  FaBell: () => <div data-testid="fa-bell" />,
  FaPlus: () => <div data-testid="fa-plus" />,
  FaMapMarkerAlt: () => <div data-testid="fa-map-marker-alt" />,
  FaCalendarAlt: () => <div data-testid="fa-calendar-alt" />,
  FaCompass: () => <div data-testid="fa-compass" />,
  FaArrowLeft: () => <div data-testid="fa-arrow-left" />,
  FaCog: () => <div data-testid="fa-cog" />,
  FaSignOutAlt: () => <div data-testid="fa-sign-out-alt" />,
  FaTrophy: () => <div data-testid="fa-trophy" />,
  FaHeart: () => <div data-testid="fa-heart" />,
  FaShareAlt: () => <div data-testid="fa-share-alt" />,
  FaEdit: () => <div data-testid="fa-edit" />,
  FaShieldAlt: () => <div data-testid="fa-shield-alt" />,
  FaQuestionCircle: () => <div data-testid="fa-question-circle" />,
}));

describe('Pages Tests', () => {
  const mockPush = jest.fn();
  const mockShowToast = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useToast as jest.Mock).mockReturnValue({
      showToast: mockShowToast,
    });
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      setUser: mockSetUser,
    });
  });

  describe('Main Page', () => {
    it('should redirect to login when user is not authenticated', async () => {
      const MainPage = require('@/app/main/page').default;
      
      render(<MainPage />);
      
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('should render loading state when user is not authenticated', async () => {
      const MainPage = require('@/app/main/page').default;
      
      render(<MainPage />);
      
      expect(screen.getByText('로그인 확인 중...')).toBeInTheDocument();
    });

    it('should render main content when user is authenticated', async () => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: '1', nickname: 'Test User' },
        setUser: mockSetUser,
      });

      const MainPage = require('@/app/main/page').default;
      
      render(<MainPage />);
      
      expect(screen.getByText(/안녕하세요, Test User님!/)).toBeInTheDocument();
    });
  });

  describe('My Page', () => {
    it('should redirect to login when user is not authenticated', async () => {
      const MyPage = require('@/app/my-page/page').default;
      
      render(<MyPage />);
      
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('should render profile section when user is authenticated', async () => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: '1', nickname: 'Test User', profileImage: 'test.jpg' },
        setUser: mockSetUser,
      });

      const MyPage = require('@/app/my-page/page').default;
      
      render(<MyPage />);
      
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText(/Level 5/)).toBeInTheDocument();
    });

    it('should display user statistics', async () => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: '1', nickname: 'Test User' },
        setUser: mockSetUser,
      });

      const MyPage = require('@/app/my-page/page').default;
      
      render(<MyPage />);
      
      expect(screen.getByText('12')).toBeInTheDocument(); // totalTrips
      expect(screen.getByText('28')).toBeInTheDocument(); // totalDays
      expect(screen.getByText('2450km')).toBeInTheDocument(); // totalDistance
      expect(screen.getByText('4')).toBeInTheDocument(); // earnedBadges.length
    });

    it('should display badges section', async () => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: '1', nickname: 'Test User' },
        setUser: mockSetUser,
      });

      const MyPage = require('@/app/my-page/page').default;
      
      render(<MyPage />);
      
      // Click on badges menu
      const badgesButton = screen.getByText('배지 & 도장');
      badgesButton.click();
      
      expect(screen.getByText('나의 배지')).toBeInTheDocument();
      expect(screen.getByText('첫 여행')).toBeInTheDocument();
      expect(screen.getByText('탐험가')).toBeInTheDocument();
    });
  });

  describe('Login Page', () => {
    it('should render login form', async () => {
      const LoginPage = require('@/app/login/page').default;
      
      render(<LoginPage />);
      
      expect(screen.getByText('GMTrip에 오신 것을 환영합니다')).toBeInTheDocument();
      expect(screen.getByText('카카오로 3초만에 시작하기')).toBeInTheDocument();
      expect(screen.getByText('비회원으로 둘러보기')).toBeInTheDocument();
    });

    it('should redirect to main when user is already authenticated', async () => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: '1', nickname: 'Test User' },
        setUser: mockSetUser,
      });

      const LoginPage = require('@/app/login/page').default;
      
      render(<LoginPage />);
      
      expect(mockPush).toHaveBeenCalledWith('/main');
    });
  });

  describe('Landing Page', () => {
    it('should render landing page content', async () => {
      const LandingPage = require('@/app/page').default;
      
      render(<LandingPage />);
      
      expect(screen.getByText(/한 번의 여행이 지나가버리는 기억이 아닌/)).toBeInTheDocument();
      expect(screen.getByText('지금 시작하기')).toBeInTheDocument();
      expect(screen.getByText('왜 GMTrip을 선택해야 할까요?')).toBeInTheDocument();
    });
  });
});
