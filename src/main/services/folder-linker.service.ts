import { InstallationLocationService } from "./installation-location.service";
import log from "electron-log";
import { deleteFolder, ensureFolderExist, moveFolderContent, pathExist, unlinkPath } from "../helpers/fs.helpers";
import { lstat, symlink } from "fs/promises";
import path from "path";
import { copy } from "fs-extra";

export class FolderLinkerService {

    private static instance: FolderLinkerService;

    public static getInstance(): FolderLinkerService {
        if (!FolderLinkerService.instance) {
            FolderLinkerService.instance = new FolderLinkerService();
        }
        return FolderLinkerService.instance;
    }

    private readonly installLocationService = InstallationLocationService.getInstance();

    private readonly sharedFolder: string;

    private constructor(){
        this.installLocationService = InstallationLocationService.getInstance();

        this.sharedFolder = this.installLocationService.sharedContentPath;
    }

    private getSharedFolder(folderPath: string, intermediateFolder?: string): string {
        return path.join(this.sharedFolder, intermediateFolder ?? "", path.basename(folderPath));
    }

    public async linkFolder(folderPath: string, options?: LinkOptions): Promise<void> {

        if(await this.isFolderSymlink(folderPath)){ return; }

        const sharedPath = this.getSharedFolder(folderPath, options?.intermediateFolder);

        await ensureFolderExist(folderPath);
        await ensureFolderExist(sharedPath);

        if(options?.keepContents !== false){
            await moveFolderContent(folderPath, sharedPath).toPromise();
        }
        
        await deleteFolder(folderPath);

        return symlink(sharedPath, folderPath, "junction");
    }

    public async unlinkFolder(folderPath: string, options?: LinkOptions): Promise<void> {

        if(!(await this.isFolderSymlink(folderPath))){ return; }
        await unlinkPath(folderPath);

        const sharedPath = this.getSharedFolder(folderPath, options?.intermediateFolder);

        await ensureFolderExist(folderPath);

        if(options?.keepContents === false){ return; }

        await ensureFolderExist(sharedPath);

        return copy(sharedPath, folderPath, { errorOnExist: false });
    }

    public async isFolderSymlink(folder: string): Promise<boolean> {
        try{
            if(!(await pathExist(folder))){ return false; }
            return lstat(folder).then(stat => stat.isSymbolicLink());
        }
        catch(e){
            log.error(e);
        }
        return false;
    }

}

export interface LinkOptions {
    keepContents?: boolean,
    intermediateFolder?: string,
}