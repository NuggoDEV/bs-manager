import { MetaAuthErrorCodes, OculusDownloaderErrorCodes } from "shared/models/bs-version-download/oculus-download.model";
import { IpcService } from "../ipc.service";
import { ModalExitCode, ModalService } from "../modale.service";
import { NotificationService } from "../notification.service";
import { ProgressBarService } from "../progress-bar.service";
import { AbstractBsDownloaderService } from "./abstract-bs-downloader.service";
import { DownloaderServiceInterface } from "./bs-store-downloader.interface";
import { BSVersion } from "shared/bs-version.interface";
import { EnterMetaTokenModal } from "renderer/components/modal/modal-types/bs-downgrade/enter-meta-token-modal.component";
import { lastValueFrom } from "rxjs";


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

    private async doDownloadBsVersion(bsVersion: BSVersion, isVerification: boolean): Promise<BSVersion> {

        const autoDownloadFailed = false;

        return (async () => {

            const tokenRes = await this.modals.openModal(EnterMetaTokenModal);

            if(tokenRes.exitCode !== ModalExitCode.COMPLETED){
                return false;
            }

            //return lastValueFrom(this.startDownloadBsVersion({ bsVersion, isVerification, token: tokenRes.data })).then(() => true);

        })().then(res => {

            if(autoDownloadFailed || !res){
                return bsVersion;
            }

            if(isVerification){
                this.notification.notifySuccess({title: "notifications.bs-download.success.titles.verification-finished"});
            } else {
                this.notification.notifySuccess({title: "notifications.bs-download.success.titles.download-success"});
            }

            return bsVersion;
        }).finally(() => this.progressBar.hide(true));
    }
    
    downloadBsVersion(version: BSVersion): Promise<BSVersion> {
        return this.doDownloadBsVersion(version, false);
    }
    verifyBsVersion(version: BSVersion): Promise<BSVersion> {
        throw new Error("Method not implemented.");
    }
}