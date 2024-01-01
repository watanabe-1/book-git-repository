package org.book.app.study.common.util;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

public class StudyTestUtil {
    /**
     * test用のtempディレクトリのパスを返す
     */
    public static File getTestTempDirPath() {
        // システムの一時ディレクトリを取得
        String tempDir = System.getProperty("java.io.tmpdir");
        return new File(tempDir, "book-git-repository/test/static");
    }

    /**
    * test用のtempディレクトリの中のファイルの削除
    */
    public static void cleanTestTempDir() {
        // テストディレクトリのクリーンアップ
        try {
            FileUtils.cleanDirectory(getTestTempDirPath());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
