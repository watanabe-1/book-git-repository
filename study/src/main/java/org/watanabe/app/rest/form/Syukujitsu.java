package org.watanabe.app.rest.form;

import java.util.Date;
import lombok.Data;

/**
 * 祝日一覧のentityクラス
 */
@Data
public class Syukujitsu {

  /**
   * 祝日
   */
  private Date date;

  /**
   * 祝日名
   */
  private String name;

}