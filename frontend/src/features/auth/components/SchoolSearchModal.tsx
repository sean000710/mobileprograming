// A3. 학교 찾기 모달 (디자인에는 없는 화면이라 공통 부품으로 간단히 구성했어요 — 담당자가 다듬어 주세요)
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';

import { searchSchools } from '@/features/auth/api';
import { AppText, Button, EmptyState, TextField, TopBar } from '@/shared/ui';
import { colors } from '@/shared/theme';
import type { School } from '@/types/models';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (school: School) => void;
};

export function SchoolSearchModal({ visible, onClose, onSelect }: Props) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<School[] | null>(null);
  const [loading, setLoading] = useState(false);

  const onSearch = async () => {
    setLoading(true);
    setResults(await searchSchools(keyword));
    setLoading(false);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.flex}>
        <TopBar title="학교 찾기" showBack backIcon="x" onBack={onClose} />
        <View style={styles.search}>
          <TextField
            icon="search"
            placeholder="학교 이름을 입력하세요"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={onSearch}
            returnKeyType="search"
            right={<Button title="검색" variant="warm" size="sm" onPress={onSearch} loading={loading} />}
          />
        </View>
        <FlatList
          data={results ?? []}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => (
            <Pressable style={styles.item} onPress={() => onSelect(item)}>
              <AppText variant="bodyBold">{item.name}</AppText>
              <AppText variant="caption">{item.region}</AppText>
            </Pressable>
          )}
          ListEmptyComponent={results ? <EmptyState icon="school" message="검색 결과가 없어요" /> : undefined}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  search: { flexDirection: 'row', padding: 20 },
  item: {
    gap: 2,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
});
