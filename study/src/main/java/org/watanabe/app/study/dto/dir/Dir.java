package org.watanabe.app.study.dto.dir;

import java.io.File;
import lombok.Data;

/**
 * 起動時のパスを格納するクラス
 */
@Data
public class Dir {

  /**
   * 起動時のパス
   */
  private File staticFileDir;

}
