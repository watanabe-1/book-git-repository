package org.book.app.study.form;

import java.io.Serializable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class HogeForm implements Serializable {

  @NotBlank
  @Size(min = 1, max = 256)
  private String hogeName;

  @NotBlank
  private String selectedHogeItem;

  private String[] selectedHogeItems;

  @NotBlank
  private String hogeRadio;

  @NotEmpty
  private String[] hogeCheckBox;

  public String getHogeName() {
    return hogeName;
  }

  public void setHogeName(String hogeName) {
    this.hogeName = hogeName;
  }

  public String getSelectedHogeItem() {
    return selectedHogeItem;
  }

  public void setSelectedHogeItem(String selectedHogeItem) {
    this.selectedHogeItem = selectedHogeItem;
  }

  public String[] getSelectedHogeItems() {
    return selectedHogeItems;
  }

  public void setSelectedHogeItems(String[] selectedHogeItems) {
    this.selectedHogeItems = selectedHogeItems;
  }

  public String gethogeRadio() {
    return hogeRadio;
  }

  public void sethogeRadio(String hogeRadio) {
    this.hogeRadio = hogeRadio;
  }

  public String[] getHogeCheckBox() {
    return hogeCheckBox;
  }

  public void setHogeCheckBox(String[] hogeCheckBox) {
    this.hogeCheckBox = hogeCheckBox;
  }
}
