
export class BsQuestDownloaderService {
    private static instance: BsQuestDownloaderService;

    public static getInstance(): BsQuestDownloaderService {
        if (!BsQuestDownloaderService) {
            BsQuestDownloaderService.instance = new BsQuestDownloaderService();
        }

        return BsQuestDownloaderService.instance;
    }
}