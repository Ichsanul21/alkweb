<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class DownloadIp2LocationDb extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ip2location:download';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Download and install the latest IP2LOCATION-LITE-DB11.BIN database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Downloading IP2Location LITE DB11...');
        
        $token = env('IP2LOCATION_DOWNLOAD_TOKEN');
        if (!$token) {
            $this->error('IP2LOCATION_DOWNLOAD_TOKEN is missing in your .env file.');
            return Command::FAILURE;
        }

        $url = "https://www.ip2location.com/download/?token={$token}&file=DB11LITEBIN";
        $zipPath = storage_path('app/ip2location.zip');
        $extractPath = storage_path('app/ip2location_temp');
        $finalDir = database_path('ip2location');
        $finalPath = $finalDir . '/IP2LOCATION.BIN';

        // 1. Download ZIP
        if (!copy($url, $zipPath)) {
            $this->error('Failed to download database from IP2Location API.');
            return Command::FAILURE;
        }

        // 2. Extract ZIP
        $this->info('Extracting database...');
        $zip = new ZipArchive;
        if ($zip->open($zipPath) === TRUE) {
            $zip->extractTo($extractPath);
            $zip->close();
            
            // 3. Move BIN file
            if (!file_exists($finalDir)) {
                mkdir($finalDir, 0755, true);
            }
            
            // DB11 BIN file is named IP2LOCATION-LITE-DB11.BIN inside the zip
            $extractedBinPath = $extractPath . '/IP2LOCATION-LITE-DB11.BIN';
            if (file_exists($extractedBinPath)) {
                rename($extractedBinPath, $finalPath);
                $this->info('Database successfully installed at: ' . $finalPath);
            } else {
                $this->error('Could not find IP2LOCATION-LITE-DB11.BIN inside the extracted archive.');
            }

            // Cleanup
            unlink($zipPath);
            $this->deleteDirectory($extractPath);
            
            return Command::SUCCESS;
        } else {
            $this->error('Failed to open the downloaded ZIP archive.');
            return Command::FAILURE;
        }
    }

    private function deleteDirectory($dir) {
        if (!file_exists($dir)) {
            return true;
        }
        if (!is_dir($dir)) {
            return unlink($dir);
        }
        foreach (scandir($dir) as $item) {
            if ($item == '.' || $item == '..') {
                continue;
            }
            if (!$this->deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
                return false;
            }
        }
        return rmdir($dir);
    }
}
