import { Test, TestingModule } from '@nestjs/testing';
import { StreaksController } from './streaks.controller';

describe('StreaksController', () => {
  let controller: StreaksController;

  beforeEach(async () => {
    const mockGateway = {
      getExampleData: jest.fn(() => ({ userData: [] })),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreaksController],
      providers: [
        { provide: 'STREAKS_GATEWAY', useValue: mockGateway },
        require('./streaks.service').StreaksService,
      ],
    }).compile();

    controller = module.get<StreaksController>(StreaksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
