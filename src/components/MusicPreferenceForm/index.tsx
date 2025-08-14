'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface MusicPreferenceFormProps {
  onComplete: () => void;
}

interface FormData {
  mainInstrument: number;
  genres: number[];
  experience: number;
  purpose: number;
  customGoal: string;
}

export default function MusicPreferenceForm({
  onComplete,
}: MusicPreferenceFormProps) {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    mainInstrument: 0,
    genres: [],
    experience: 1,
    purpose: 0,
    customGoal: '',
  });

  const [customInstrument, setCustomInstrument] = useState('');
  const [customGenre, setCustomGenre] = useState('');

  const handleGenreChange = (genreId: number, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        genres: [...prev.genres, genreId],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        genres: prev.genres.filter((g) => g !== genreId),
      }));
    }
  };

  const handleSubmit = () => {
    // TODO: API 호출하여 데이터 저장
    onComplete();
    toast({
      title: '서비스 준비중입니다.',
      variant: 'default',
      duration: 1000,
    });
  };

  const isFormValid =
    formData.mainInstrument &&
    (formData.mainInstrument !== 999 || customInstrument.trim()) &&
    formData.genres.length > 0 &&
    (!formData.genres.includes(999) || customGenre.trim()) &&
    formData.experience &&
    formData.purpose;

  return (
    <div className="w-full space-y-8 max-h-[70vh] overflow-y-auto">
      <header>
        회원님의 음악경험과 관심사를 알려주시면
        <br />더 나은 학습 환경을 준비할게요!
      </header>
      {/* 1. 주 사용 악기 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          1. 주 사용 악기 <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-gray-600">
          회원님이 주로 연습하는 악기를 알려주세요.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 1, label: '기타', icon: '🎸' },
            { value: 2, label: '피아노 / 건반', icon: '🎹' },
            { value: 3, label: '보컬', icon: '🎤' },
            { value: 4, label: '드럼', icon: '🥁' },
            { value: 5, label: '관악기', icon: '🎷' },
            { value: 6, label: '현악기', icon: '🎻' },
            {
              value: 7,
              label: '전자음악 (MIDI, DAW 등)',
              icon: '🎧',
            },
          ].map((instrument) => (
            <label
              key={instrument.value}
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="mainInstrument"
                value={instrument.value}
                checked={formData.mainInstrument === instrument.value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    mainInstrument: Number(e.target.value),
                  }))
                }
                className="text-purple-600"
              />
              <span className="text-2xl">{instrument.icon}</span>
              <span className="text-sm">{instrument.label}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            name="mainInstrument"
            value="custom"
            checked={formData.mainInstrument === 999}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                mainInstrument: 999,
              }))
            }
            className="text-purple-600"
          />
          <span className="text-2xl">✍️</span>
          <span className="text-sm">직접 입력</span>
          <Input
            placeholder="악기명을 입력하세요"
            value={customInstrument}
            onChange={(e) => setCustomInstrument(e.target.value)}
            className="flex-1 max-w-xs"
            disabled={formData.mainInstrument !== 999}
          />
        </div>
      </div>

      {/* 2. 관심 장르 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          2. 관심 장르 (복수 선택) <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-gray-600">관심 있는 장르를 선택해 주세요.</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 1, name: 'POP' },
            { id: 2, name: 'Jazz' },
            { id: 3, name: 'Rock' },
            { id: 4, name: 'Classic' },
            { id: 5, name: 'R&B / Soul' },
            { id: 6, name: 'HipHop' },
            { id: 7, name: 'Electronic' },
            { id: 8, name: 'OST / 게임음악' },
            { id: 9, name: '국악' },
          ].map((genre) => (
            <label
              key={genre.id}
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <Checkbox
                checked={formData.genres.includes(genre.id)}
                onCheckedChange={(checked) =>
                  handleGenreChange(genre.id, Boolean(checked))
                }
                className="text-purple-600"
              />
              <span className="text-sm">{genre.name}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={formData.genres.includes(999)}
            onCheckedChange={(checked) =>
              handleGenreChange(999, Boolean(checked))
            }
            className="text-purple-600"
          />
          <span className="text-sm">직접 입력</span>
          <Input
            placeholder="장르명을 입력하세요"
            value={customGenre}
            onChange={(e) => setCustomGenre(e.target.value)}
            className="flex-1 max-w-xs"
            disabled={!formData.genres.includes(999)}
          />
        </div>
      </div>

      {/* 3. 음악 학습 경험 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          3. 음악 학습 경험 <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-gray-600">음악을 얼마나 해보셨나요?</p>
        <div className="space-y-3">
          {[
            { value: 1, label: '처음 시작해요 (입문)' },
            { value: 2, label: '1년 미만' },
            { value: 3, label: '1~3년' },
            { value: 4, label: '3년 이상' },
          ].map((exp) => (
            <label
              key={exp.value}
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="experience"
                value={exp.value}
                checked={formData.experience === exp.value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experience: Number(e.target.value),
                  }))
                }
                className="text-purple-600"
              />
              <span className="text-sm">{exp.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. 학습 목적 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          4. 학습 목적 <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-gray-600">
          하모닉허브를 어떤 목적으로 사용하고 싶나요?
        </p>
        <div className="space-y-3">
          {[
            { value: 1, label: '취미로 배우고 있어요.' },
            { value: 2, label: '입시/오디션 준비중이에요.' },
            {
              value: 3,
              label: '공연/유튜브 등 활동을 하고 있어요.',
            },
            { value: 4, label: '음악을 직업으로 하고 있어요.' },
            { value: 5, label: '아직 잘 모르겠어요.' },
          ].map((purpose) => (
            <label
              key={purpose.value}
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="purpose"
                value={purpose.value}
                checked={formData.purpose === purpose.value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    purpose: Number(e.target.value),
                  }))
                }
                className="text-purple-600"
              />
              <span className="text-sm">{purpose.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. 나만의 목표 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">5. 나만의 목표</h3>
        <p className="text-sm text-gray-600">
          예) 3개월 안에 코드 반주 마스터하기, 자작곡 1곡 만들기 등
        </p>
        <Input
          placeholder="목표를 입력하세요"
          value={formData.customGoal}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, customGoal: e.target.value }))
          }
          className="w-full"
        />
      </div>

      {/* 제출 버튼 */}
      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full text-white cursor-pointer ${
            isFormValid
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          설정완료
        </Button>
      </div>
    </div>
  );
}
