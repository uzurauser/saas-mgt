'use client';

import { useEffect } from 'react';
import { 
  checklistStatusOptions, 
  antisocialStatusOptions,
  getChecklistStatusLabel,
  getAntisocialStatusLabel,
  type ChecklistStatusEnum,
  type AntisocialCheckStatus
} from "@/types/checklist"

export default function DebugStatus() {
  useEffect(() => {
    // ステータスと色の対応をログに出力
    console.log('=== チェックリストステータスと色の対応 ===');
    checklistStatusOptions.forEach(opt => {
      console.log(`ステータス: ${opt.value}, ラベル: ${opt.label}, 色: ${opt.color}`);
    });
    
    console.log('\n=== 反社会的勢力チェックステータスと色の対応 ===');
    antisocialStatusOptions.forEach(opt => {
      console.log(`ステータス: ${opt.value}, ラベル: ${opt.label}, 色: ${opt.color}`);
    });

    // テスト用の値でラベル変換を確認
    console.log('\n=== テスト値でのラベル変換確認 ===');
    
    // チェックリストステータスのテスト
    const testChecklistValues: (ChecklistStatusEnum | string)[] = [
      'not_created', 'completed', 'not_required', 'is_examined', 'unknown_value'
    ];
    
    console.log('チェックリストステータス変換テスト:');
    testChecklistValues.forEach(value => {
      const label = getChecklistStatusLabel(value as ChecklistStatusEnum);
      const option = checklistStatusOptions.find(opt => opt.value === value);
      const color = option ? option.color : '#000000';
      console.log(`元の値: ${value} -> ラベル: ${label}, 色: ${color}`);
      
      // 実際のBadgeコンポーネントが受け取る値を確認
      console.log(`  Badgeに渡される値: ${label}`);
      console.log(`  想定される色: ${color}`);
    });
    
    // 反社会的勢力チェックステータスのテスト
    const testAntisocialValues: (AntisocialCheckStatus | string)[] = [
      'unchecked', 'checked', 'check_exception', 'monitor_checked', 'unknown_value'
    ];
    
    console.log('\n反社会的勢力チェックステータス変換テスト:');
    testAntisocialValues.forEach(value => {
      const label = getAntisocialStatusLabel(value as AntisocialCheckStatus);
      const option = antisocialStatusOptions.find(opt => opt.value === value);
      const color = option ? option.color : '#000000';
      console.log(`元の値: ${value} -> ラベル: ${label}, 色: ${color}`);
      
      // 実際のBadgeコンポーネントが受け取る値を確認
      console.log(`  Badgeに渡される値: ${label}`);
      console.log(`  想定される色: ${color}`);
    });

  }, []);

  return null; // 何もレンダリングしない
}
