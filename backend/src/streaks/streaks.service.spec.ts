import { Test, TestingModule } from '@nestjs/testing';
import { StreaksService } from './streaks.service';

describe('StreaksService', () => {
  let service: StreaksService;

  beforeEach(async () => {
    const mockGateway = {
      getExampleData: jest.fn(() => ({ userData: [] })),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreaksService,
        { provide: 'USER_DATA_GATEWAY', useValue: mockGateway },
      ],
    }).compile();

    service = module.get<StreaksService>(StreaksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLatestStreak', () => {
    it('should return all days as INCOMPLETE if no activity', () => {
      const userData = [
        { date: '2024-06-01', activities: 0 },
        { date: '2024-06-02', activities: 0 },
        { date: '2024-06-03', activities: 0 },
        { date: '2024-06-04', activities: 0 },
        { date: '2024-06-05', activities: 0 },
        { date: '2024-06-06', activities: 0 },
        { date: '2024-06-07', activities: 0 },
      ];
      const today = '2024-06-07';
      const result = service.getLatestStreak(userData, today);
      expect(result.activitiesToday).toBe(0);
      expect(result.total).toBe(0);
      expect(result.days).toHaveLength(7);
      result.days.forEach((day) => {
        expect(day.state).toBe('INCOMPLETE');
      });
    });

    it('should return all days as COMPLETED if all have activity', () => {
      const userData = [
        { date: '2024-06-01', activities: 1 },
        { date: '2024-06-02', activities: 1 },
        { date: '2024-06-03', activities: 1 },
        { date: '2024-06-04', activities: 1 },
        { date: '2024-06-05', activities: 1 },
        { date: '2024-06-06', activities: 1 },
        { date: '2024-06-07', activities: 1 },
      ];
      const today = '2024-06-07';
      const result = service.getLatestStreak(userData, today);
      expect(result.activitiesToday).toBe(1);
      expect(result.total).toBe(7);
      expect(result.days).toHaveLength(7);
      result.days.forEach((day) => {
        expect(day.state).toBe('COMPLETED');
      });
    });

    it('should mark days as SAVED when activities threshold is met', () => {
      const userData = [
        { date: '2024-06-01', activities: 0 },
        { date: '2024-06-02', activities: 2 }, // SAVED (first after incomplete)
        { date: '2024-06-03', activities: 1 }, // COMPLETED
        { date: '2024-06-04', activities: 0 },
        { date: '2024-06-05', activities: 2 }, // SAVED (2 after last completed)
        { date: '2024-06-06', activities: 0 },
        { date: '2024-06-07', activities: 3 }, // SAVED (3 after last completed)
      ];
      const today = '2024-06-07';
      const result = service.getLatestStreak(userData, today);
      expect(result.days.find((d) => d.date === '2024-06-02')?.state).toBe(
        'COMPLETED',
      );
      expect(result.days.find((d) => d.date === '2024-06-05')?.state).toBe(
        'SAVED',
      );
      expect(result.days.find((d) => d.date === '2024-06-07')?.state).toBe(
        'SAVED',
      );
    });

    it('should mark days as AT_RISK when appropriate', () => {
      const userData = [
        { date: '2024-06-01', activities: 1 }, // COMPLETED
        { date: '2024-06-02', activities: 0 }, // AT_RISK (1 after completed)
        { date: '2024-06-03', activities: 0 }, // AT_RISK (2 after completed)
        { date: '2024-06-04', activities: 0 }, // INCOMPLETE
        { date: '2024-06-05', activities: 1 }, // COMPLETED
        { date: '2024-06-06', activities: 0 }, // AT_RISK (1 after completed)
        { date: '2024-06-07', activities: 0 }, // AT_RISK (2 after completed)
      ];
      const today = '2024-06-07';
      const result = service.getLatestStreak(userData, today);
      expect(result.days.find((d) => d.date === '2024-06-02')?.state).toBe(
        'AT_RISK',
      );
      expect(result.days.find((d) => d.date === '2024-06-03')?.state).toBe(
        'AT_RISK',
      );
      expect(result.days.find((d) => d.date === '2024-06-06')?.state).toBe(
        'AT_RISK',
      );
      expect(result.days.find((d) => d.date === '2024-06-07')?.state).toBe(
        'AT_RISK',
      );
    });

    it('should handle a mix of completed, at risk, saved, and incomplete days', () => {
      const userData = [
        { date: '2024-06-01', activities: 1 },
        { date: '2024-06-02', activities: 0 },
        { date: '2024-06-03', activities: 2 },
        { date: '2024-06-04', activities: 0 },
        { date: '2024-06-05', activities: 0 },
        { date: '2024-06-06', activities: 1 },
        { date: '2024-06-07', activities: 0 },
      ];
      const today = '2024-06-07';
      const result = service.getLatestStreak(userData, today);
      expect(result.days).toHaveLength(7);
      // Spot check a few states
      expect(result.days.find((d) => d.date === '2024-06-01')?.state).toBe(
        'COMPLETED',
      );
      expect(result.days.find((d) => d.date === '2024-06-03')?.state).toBe(
        'SAVED',
      );
      expect(result.days.find((d) => d.date === '2024-06-02')?.state).toBe(
        'AT_RISK',
      );
      expect(result.days.find((d) => d.date === '2024-06-05')?.state).toBe(
        'AT_RISK',
      );
    });
  });
});
