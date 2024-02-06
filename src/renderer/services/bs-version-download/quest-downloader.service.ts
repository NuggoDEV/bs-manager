import { MetaAuthErrorCodes, OculusDownloaderErrorCodes } from "shared/models/bs-version-download/oculus-download.model";
import { IpcService } from "../ipc.service";
import { ModalService } from "../modale.service";
import { NotificationService } from "../notification.service";
import { ProgressBarService } from "../progress-bar.service";
import { AbstractBsDownloaderService } from "./abstract-bs-downloader.service";
import { DownloaderServiceInterface } from "./bs-store-downloader.interface";
import { BSVersion } from "shared/bs-version.interface";


export class QuestDownloaderService extends AbstractBsDownloaderService implements DownloaderServiceInterface
{
    private static instance: QuestDownloaderService;

    public static getInstance(): QuestDownloaderService {
        if (!QuestDownloaderService.instance) {
            QuestDownloaderService.instance = new QuestDownloaderService();
        }

        return QuestDownloaderService.instance;
    }

    private readonly ipc: IpcService;
    private readonly progressBar: ProgressBarService;
    private readonly notification: NotificationService;
    private readonly modals: ModalService;

    private readonly DISPLAYABLE_ERROR_CODES: string[] = [...Object.values(MetaAuthErrorCodes), ...Object.values(OculusDownloaderErrorCodes)];

    private constructor() {
        super();
        this.ipc = IpcService.getInstance();
        this.progressBar = ProgressBarService.getInstance();
        this.notification = NotificationService.getInstance();
        this.modals = ModalService.getInstance();
    }

    
    downloadBsVersion(version: BSVersion): Promise<BSVersion> {
        throw new Error("Method not implemented.");
    }
    verifyBsVersion(version: BSVersion): Promise<BSVersion> {
        throw new Error("Method not implemented.");
    }
}