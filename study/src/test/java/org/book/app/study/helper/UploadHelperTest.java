package org.book.app.study.helper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.io.File;
import java.io.IOException;

import org.book.app.study.dto.dir.Dir;
import org.book.app.study.entity.Image;
import org.book.app.study.form.CategoryForm;
import org.book.app.study.service.ImageService;
import org.book.app.study.util.StudyStringUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import common.BaseTest;
import common.util.StudyTestUtil;

@SpringBootTest
class UploadHelperTest extends BaseTest {

    private final String TEMP_DIR = "temp";
    private final String TEMP_IMAGE_DIR = "images";
    private final String TEMP_ICON_DIR = "icons";

    @Mock
    private ImageService imageService;

    @Mock
    private Dir fileDir;

    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private UploadHelper uploadHelper;

    @BeforeEach
    protected void setUp() {
        // 親クラス(共通処理)setUpの呼び出し
        super.setUp();
        // db処理のモック
        when(imageService.saveOne(new Image())).thenReturn(1);
        // システムの一時ディレクトリを取得
        when(fileDir.getStaticFileDir()).thenReturn(StudyTestUtil.getTestTempDirPath());
        // テスト用のプロパティ値を設定
        assertNotNull(uploadHelper, "UploadHelper is null");
        ReflectionTestUtils.setField(uploadHelper, "uploadTmpDir", new File(TEMP_DIR));
        assertNotNull(uploadHelper, "UploadHelper is null");
        ReflectionTestUtils.setField(uploadHelper, "uploadImgDefDir", new File(TEMP_IMAGE_DIR));
        assertNotNull(uploadHelper, "UploadHelper is null");
        ReflectionTestUtils.setField(uploadHelper, "uploadImgDefDirPath", TEMP_IMAGE_DIR);
        assertNotNull(uploadHelper, "UploadHelper is null");
        ReflectionTestUtils.setField(uploadHelper, "uploadIconDirPath", TEMP_ICON_DIR);
    }

    @Test
    void testSaveTemporaryFile() throws IOException {
        byte[] content = "file content".getBytes();
        MultipartFile mockMultipartFile = new MockMultipartFile("file", "file.txt", "text/plain", content);

        File result = uploadHelper.saveTemporaryFile(mockMultipartFile);

        // 一時ファイルが正しく保存されたことを確認
        assertNotNull(result);
        assertTrue(result.exists() && !result.isDirectory());

        // ファイルが正しい一時ディレクトリ内にあるかどうか
        String expectedDirPath = StudyStringUtil.pathJoin(
                StudyTestUtil.getTestTempDirPath().getAbsolutePath(), TEMP_DIR);
        String actualDirPath = result.getParentFile().getAbsolutePath();
        assertEquals(actualDirPath, expectedDirPath);
    }

    @Test
    void testSaveIconFile() {
        final String ICON_FILE_NAME = "icon";
        final String ICON_FILE_EXT = "png";
        final String ICON_FILE = StudyStringUtil.keyJoin(ICON_FILE_NAME, ICON_FILE_EXT);
        final String IMAGE_TYPE = MediaType.IMAGE_PNG.toString();
        // tempフォルダにファイルを作成
        byte[] content = "file content".getBytes();
        MultipartFile mockMultipartFile = new MockMultipartFile(ICON_FILE_NAME, ICON_FILE, IMAGE_TYPE, content);
        File tempFile = uploadHelper.saveTemporaryFile(mockMultipartFile);

        // モックのCategoryFormを作成
        CategoryForm mockForm = new CategoryForm();
        mockForm.setImgId(tempFile.getName());
        mockForm.setImgExt(ICON_FILE_EXT);
        mockForm.setImgType(IMAGE_TYPE);

        // メソッドの実行
        uploadHelper.saveIconFile(mockForm);

        String iconFileName = String.format("%s_%s_%s.%s", "category", TEMP_ICON_DIR, mockForm.getImgId(),
                ICON_FILE_EXT);
        String iconFileDir = StudyStringUtil.pathJoin(TEMP_IMAGE_DIR, TEMP_ICON_DIR, iconFileName);
        File iconFile = new File(StudyTestUtil.getTestTempDirPath(), iconFileDir);

        //ファイルが正しく保存されたことを確認
        assertNotNull(iconFile);
        assertTrue(iconFile.exists() && !iconFile.isDirectory());
    }

    @Test
    void testMoveTemporaryFileToImagesFolder() {
        final String ICON_FILE_NAME = "icon";
        final String ICON_FILE_EXT = "png";
        final String ICON_FILE = StudyStringUtil.keyJoin(ICON_FILE_NAME, ICON_FILE_EXT);
        final String IMAGE_TYPE = MediaType.IMAGE_PNG.toString();
        // tempフォルダにファイルを作成
        byte[] content = "file content".getBytes();
        MultipartFile mockMultipartFile = new MockMultipartFile(ICON_FILE_NAME, ICON_FILE, IMAGE_TYPE, content);
        File tempFile = uploadHelper.saveTemporaryFile(mockMultipartFile);

        String iconFileName = "test";
        // メソッドの実行
        uploadHelper.moveTemporaryFileToImagesFolder(iconFileName, tempFile.getName(), TEMP_ICON_DIR);

        String iconFileDir = StudyStringUtil.pathJoin(TEMP_IMAGE_DIR, TEMP_ICON_DIR, iconFileName);
        File iconFile = new File(StudyTestUtil.getTestTempDirPath(), iconFileDir);

        //ファイルが正しく保存されたことを確認
        assertNotNull(iconFile);
        assertTrue(iconFile.exists() && !iconFile.isDirectory());
    }

    @Test
    void testMoveTemporaryFileToImagesFolder_noAddPath() {
        final String ICON_FILE_NAME = "icon";
        final String ICON_FILE_EXT = "png";
        final String ICON_FILE = StudyStringUtil.keyJoin(ICON_FILE_NAME, ICON_FILE_EXT);
        final String IMAGE_TYPE = MediaType.IMAGE_PNG.toString();
        // tempフォルダにファイルを作成
        byte[] content = "file content".getBytes();
        MultipartFile mockMultipartFile = new MockMultipartFile(ICON_FILE_NAME, ICON_FILE, IMAGE_TYPE, content);
        File tempFile = uploadHelper.saveTemporaryFile(mockMultipartFile);

        String iconFileName = "test";
        // メソッドの実行
        uploadHelper.moveTemporaryFileToImagesFolder(iconFileName, tempFile.getName());

        String iconFileDir = StudyStringUtil.pathJoin(TEMP_IMAGE_DIR, iconFileName);
        File iconFile = new File(StudyTestUtil.getTestTempDirPath(), iconFileDir);

        //ファイルが正しく保存されたことを確認
        assertNotNull(iconFile);
        assertTrue(iconFile.exists() && !iconFile.isDirectory());
    }

    @Test
    void testEncodeBase64() throws Exception {
        final String ICON_FILE_NAME = "icon";
        final String ICON_FILE_EXT = "png";
        final String ICON_FILE = StudyStringUtil.keyJoin(ICON_FILE_NAME, ICON_FILE_EXT);
        final String IMAGE_TYPE = MediaType.IMAGE_PNG.toString();
        // モックのMultipartFileを作成
        byte[] content = "file content".getBytes();
        MultipartFile mockMultipartFile = new MockMultipartFile(ICON_FILE_NAME, ICON_FILE, IMAGE_TYPE, content);

        // メソッドの実行
        String base64String = uploadHelper.encodeBase64(mockMultipartFile, "jpg");

        // Base64エンコードされた文字列が正しいことを確認
        assertTrue(base64String.startsWith("data:image/jpg;base64,"));
    }
}
