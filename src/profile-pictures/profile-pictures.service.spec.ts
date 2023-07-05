import { Test, TestingModule } from '@nestjs/testing';
import { ProfilePicture } from '@prisma/client';
import { ProfilePicturesService } from './profile-pictures.service';

const InMemoryProfilePictures: Array<ProfilePicture> = [
  {
    id: '1c937b93-b38e-47dd-9fe8-a99b9802ed9e',
    title: 'Aristotle',
    url: 'http://boolestation.com/public/aristotle.png'
  },
  {
    id: '45a215cd-0ad1-48ae-89b3-cb429bf86512',
    title: 'Immanuel Kant',
    url: 'http://boolestation.com/public/kant.png'
  },
  {
    id: '2c937b93-b38e-47dd-9fe8-a99b9802ed9e',
    title: 'Russel',
    url: 'http://boolestation.com/public/russel.png'
  },
  {
    id: '3c937b93-b38e-47dd-9fe8-a99b9802ed9e',
    title: 'Frege',
    url: 'http://boolestation.com/public/frege.png'
  },
]



describe('ProfilePicturesService', () => {
  let service: ProfilePicturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfilePicturesService],
    }).compile();

    service = module.get<ProfilePicturesService>(ProfilePicturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
