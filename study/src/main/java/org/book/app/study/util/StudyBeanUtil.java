package org.book.app.study.util;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.book.app.common.exception.BusinessException;
import org.book.app.study.entity.Entity;
import org.springframework.beans.BeanUtils;
import org.springframework.lang.NonNull;

/**
 * java beanのUtilクラスを作成
 */
public class StudyBeanUtil {

  /**
   * 引数1から引数2に同名のフィールドがあった場合、そのフィールドに同じ値をセット またstudyで固定使用しているカラムの値をセットする
   * 
   * @param source コピー元
   * @param target コピー＆セット先
   */
  public static void copyAndSetStudyEntityProperties(@NonNull Object source, @NonNull Entity target) {
    // 同名のフィールドにセット 引数1から2へ
    BeanUtils.copyProperties(source, target);
    setStudyEntityProperties(target);
  }

  /**
   * studyで固定使用しているカラムの値をセットする
   * 
   * @param target セット対象
   */
  public static void setStudyEntityProperties(Entity target) {
    // 現在日時取得
    LocalDateTime now = StudyUtil.getNowDate();
    // ログインユーザー取得
    String user = StudyUtil.getLoginUser();

    if (target.getInsUser() == null) {
      target.setInsUser(user);
      target.setInsDate(now);
    }
    target.setUpdUser(user);
    target.setUpdDate(now);
  }

  /**
   * studyで固定使用しているカラムの値にnullをセットする
   * 
   * @param target セット対象
   */
  public static void setStudyEntityPropertiesNull(Entity target) {
    target.setInsUser(null);
    target.setInsDate(null);
    target.setUpdUser(null);
    target.setUpdDate(null);
  }

  /**
   * studyで固定使用しているカラムの値にnullをセットする
   * 
   * @param target セット対象
   */
  public static void setStudyEntityListPropertiesNull(List<? extends Entity> targetList) {
    targetList.forEach((form) -> {
      StudyBeanUtil.setStudyEntityPropertiesNull(form);
    });
  }

  /**
   * sourceBeanからプロパティをコピーして、targetClassの新しいインスタンスを作成
   * 
   * @param <T> ターゲットクラスの型
   * @param sourceBean プロパティコピー元
   * @param targetClass プロパティコピー先
   * @return sourceBeanからコピーされたプロパティを持つ、新しく割り当てられたtargetClassのインスタンス
   */
  public static <T> T createInstanceFromBean(@NonNull Object sourceBean, @NonNull Class<T> targetClass) {
    return createInstanceFromBean(sourceBean, targetClass, null);
  }

  /**
   * sourceBeanからプロパティをコピーして、targetClassの新しいインスタンスを作成
   * 
   * @param <T> ターゲットクラスの型
   * @param sourceBean プロパティコピー元
   * @param targetClass プロパティコピー先
   * @param addMapping 追加マッピング用関数
   * @return sourceBeanからコピーされたプロパティを持つ、新しく割り当てられたtargetClassのインスタンス
   */
  public static <T, S> T createInstanceFromBean(@NonNull S sourceBean, @NonNull Class<T> targetClass,
      BiFunction<S, T, T> addMapping) {
    try {
      // インスタンスを作成
      Constructor<T> constructor = targetClass.getDeclaredConstructor();
      T targetInstance = constructor.newInstance();

      // プロパティをコピー
      if (targetInstance != null) {
        BeanUtils.copyProperties(sourceBean, targetInstance);
      }

      if (addMapping != null) {
        targetInstance = addMapping.apply(sourceBean, targetInstance);
      }

      return targetInstance;
    } catch (NoSuchMethodException | SecurityException | InstantiationException
        | IllegalAccessException | IllegalArgumentException
        | InvocationTargetException e) {
      throw new BusinessException("1.01.01.1007", e.getMessage());
    }
  }

  /**
   * sourceBeanListからプロパティをコピーして、targetClassの新しいインスタンスリストを作成
   * 
   * @param <T> ターゲットクラスの型
   * @param sourceBeanList プロパティコピー元
   * @param targetClass プロパティコピー先
   * @return
   */
  public static <T, S> List<T> createInstanceFromBeanList(@NonNull List<S> sourceBeanList,
      @NonNull Class<T> targetClass) {
    return createInstanceFromBeanList(sourceBeanList, targetClass, null);
  }

  /**
   * sourceBeanListからプロパティをコピーして、targetClassの新しいインスタンスリストを作成
   * 
   * @param <T> ターゲットクラスの型
   * @param sourceBeanList プロパティコピー元
   * @param targetClass プロパティコピー先
   * @param customeMapping マッピングカスタム用関数
   * @return
   */
  public static <T, S> List<T> createInstanceFromBeanList(@NonNull List<S> sourceBeanList,
      @NonNull Class<T> targetClass, Function<S, T> customeMapping) {
    return sourceBeanList
        .stream()
        .map(sourceBean -> {
          if (sourceBean == null) {
            return null;
          }
          return customeMapping != null
              ? customeMapping.apply(sourceBean)
              : StudyBeanUtil.createInstanceFromBean(sourceBean, targetClass);
        })
        .collect(Collectors.toList());
  }

}
