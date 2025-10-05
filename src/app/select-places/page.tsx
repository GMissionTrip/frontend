"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Loading } from "@/components/atoms/Loading";
import { EmptyState } from "@/components/atoms/EmptyState";
import { KakaoMapWithPlaces } from "@/components/organisms/KakaoMapWithPlaces";
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaClock, 
  FaStar, 
  FaRoute,
  FaCheck,
  FaTimes,
  FaUserPlus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useToast } from "@/components/ToastProvider";
import { usePlacesByRegion, useOptimizeRoute } from "@/hooks/queries/usePlaceQuery";
import { Place, SelectedPlace } from "@/types/place";
import "./styles.css";

type TabType = "recommended" | "selected";

export default function SelectPlacesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  // TODO: 이전 페이지에서 선택한 지역 정보 가져오기 (임시로 "강원도" 사용)
  const selectedRegion = "강원도";
  
  const [activeTab, setActiveTab] = useState<TabType>("recommended");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPlaces, setSelectedPlaces] = useState<SelectedPlace[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<any>(null);
  const [expandedPlaceId, setExpandedPlaceId] = useState<string | null>(null);

  // 장소 데이터 로드
  const { data: places = [], isLoading } = usePlacesByRegion(selectedRegion);
  
  // 경로 최적화 mutation
  const optimizeRouteMutation = useOptimizeRoute();

  // 카테고리 목록
  const categories = ["전체", "자연", "문화", "먹거리", "관광"];

  // 지도 중심 좌표 (useMemo로 캐싱)
  const mapCenter = useMemo(() => ({ lat: 38.207, lng: 128.591 }), []);

  // 필터링된 장소
  const filteredPlaces = useMemo(() => {
    let result = places;

    // 카테고리 필터
    if (selectedCategory !== "전체") {
      result = result.filter(place => place.category === selectedCategory);
    }

    // 검색어 필터
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(place => 
        place.name.toLowerCase().includes(keyword) ||
        place.description?.toLowerCase().includes(keyword) ||
        place.tags?.some(tag => tag.toLowerCase().includes(keyword))
      );
    }

    return result;
  }, [places, selectedCategory, searchKeyword]);

  // 지도 마커 클릭 처리
  const handleMapPlaceClick = (place: Place) => {
    setExpandedPlaceId(place.id);
    setActiveTab("recommended");
  };

  // 장소 담기
  const addPlaceToSelected = (place: Place) => {
    const isSelected = selectedPlaces.some(p => p.id === place.id);
    
    if (isSelected) {
      showToast(`${place.name}은(는) 이미 담겨있습니다.`, "warning");
      return;
    }

    const newPlace: SelectedPlace = {
      ...place,
      order: selectedPlaces.length + 1,
    };
    setSelectedPlaces([...selectedPlaces, newPlace]);
    showToast(`${place.name}이(가) 담겼습니다!`, "success");
  };

  // 장소 빼기
  const removePlaceFromSelected = (placeId: string) => {
    const place = selectedPlaces.find(p => p.id === placeId);
    setSelectedPlaces(prev => {
      const filtered = prev.filter(p => p.id !== placeId);
      // 순서 재정렬
      return filtered.map((p, index) => ({ ...p, order: index + 1 }));
    });
    if (place) {
      showToast(`${place.name}이(가) 제거되었습니다.`, "info");
    }
  };

  // 초대 링크 복사
  const handleInvite = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showToast("링크가 복사되었습니다!", "success");
    }).catch(() => {
      showToast("링크 복사에 실패했습니다.", "error");
    });
  };

  // 선택한 장소가 있는지 확인
  const isPlaceSelected = (placeId: string) => {
    return selectedPlaces.some(p => p.id === placeId);
  };

  // 선택 순서 가져오기
  const getPlaceOrder = (placeId: string) => {
    const place = selectedPlaces.find(p => p.id === placeId);
    return place?.order;
  };

  // 경로 최적화 실행
  const handleOptimizeRoute = async () => {
    if (selectedPlaces.length < 2) {
      showToast("최소 2개 이상의 장소를 선택해주세요.", "warning");
      return;
    }

    setIsOptimizing(true);
    
    try {
      const result = await optimizeRouteMutation.mutateAsync({
        places: selectedPlaces.map(p => p.id),
        optimizationType: "distance",
      });

      setOptimizedResult(result);
      
      // 최적화된 순서로 selectedPlaces 업데이트
      const reorderedPlaces = result.optimizedOrder.map((placeId, index) => {
        const place = selectedPlaces.find(p => p.id === placeId);
        return place ? { ...place, order: index + 1 } : null;
      }).filter(Boolean) as SelectedPlace[];
      
      setSelectedPlaces(reorderedPlaces);
      
      showToast("경로가 최적화되었습니다!", "success");
      router.push("/route-result"); // Step 4로 이동
    } catch (error) {
      showToast("경로 최적화 중 오류가 발생했습니다.", "error");
    } finally {
      setIsOptimizing(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="장소 정보를 불러오는 중..." />;
  }

  return (
    <LayoutTitleWithActions
      title="장소 선택"
      showBack
    >
      <div className="select-places-page">
        {/* 지도 영역 */}
        <div className="map-section">
          <KakaoMapWithPlaces
            places={filteredPlaces}
            selectedPlaces={selectedPlaces}
            onPlaceClick={handleMapPlaceClick}
            center={mapCenter}
          />
        </div>

        {/* 하단 탭 영역 */}
        <div className="bottom-tabs-container">
          {/* 탭 헤더 */}
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === "recommended" ? "active" : ""}`}
              onClick={() => setActiveTab("recommended")}
            >
              추천 관광지
            </button>
            <button
              className={`tab-button ${activeTab === "selected" ? "active" : ""}`}
              onClick={() => setActiveTab("selected")}
            >
              내 여행 담은 목록
              {selectedPlaces.length > 0 && (
                <span className="badge">{selectedPlaces.length}</span>
              )}
            </button>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="tabs-content">
            {activeTab === "recommended" ? (
              /* 추천 관광지 탭 */
              <div className="recommended-tab">
                {/* 검색 & 카테고리 필터 */}
                <div className="filter-section">
                  <Input
                    placeholder="장소 검색..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    leftIcon={<FaSearch />}
                    size="small"
                  />
                  
                  <div className="category-filters">
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`category-chip ${selectedCategory === category ? "active" : ""}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 장소 리스트 */}
                <div className="places-list">
                  {filteredPlaces.length === 0 ? (
                    <EmptyState
                      icon="🔍"
                      title="검색 결과가 없습니다"
                      description="다른 키워드로 검색하거나 카테고리를 변경해보세요."
                      size="small"
                    />
                  ) : (
                    filteredPlaces.map(place => (
                      <div
                        key={place.id}
                        className={`place-card ${expandedPlaceId === place.id ? "expanded" : ""}`}
                      >
                        {/* 카드 헤더 (클릭 시 펼침/접힘) */}
                        <div
                          className="card-header"
                          onClick={() => setExpandedPlaceId(
                            expandedPlaceId === place.id ? null : place.id
                          )}
                        >
                          <div className="card-thumbnail">
                            <Image
                              src={place.imageUrl || "https://via.placeholder.com/80x80"}
                              alt={place.name}
                              width={80}
                              height={80}
                              className="thumbnail-img"
                            />
                            {isPlaceSelected(place.id) && (
                              <div className="selected-badge">
                                <FaCheck />
                              </div>
                            )}
                          </div>
                          
                          <div className="card-info">
                            <div className="card-category">{place.category}</div>
                            <h3 className="card-title">{place.name}</h3>
                            {place.rating && (
                              <div className="card-rating">
                                <FaStar className="star" />
                                <span>{place.rating}</span>
                              </div>
                            )}
                          </div>

                          <button className="expand-btn">
                            {expandedPlaceId === place.id ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </button>
                        </div>

                        {/* 상세 정보 (펼쳤을 때만 표시) */}
                        {expandedPlaceId === place.id && (
                          <div className="card-detail">
                            <p className="detail-description">{place.description}</p>
                            
                            <div className="detail-meta">
                              <div className="meta-item">
                                <FaMapMarkerAlt className="meta-icon" />
                                <span>{place.address}</span>
                              </div>
                              {place.duration && (
                                <div className="meta-item">
                                  <FaClock className="meta-icon" />
                                  <span>{place.duration}분</span>
                                </div>
                              )}
                            </div>

                            {place.tags && place.tags.length > 0 && (
                              <div className="tags">
                                {place.tags.map(tag => (
                                  <span key={tag} className="tag">#{tag}</span>
                                ))}
                              </div>
                            )}

                            <Button
                              variant={isPlaceSelected(place.id) ? "outline" : "primary"}
                              size="medium"
                              onClick={() => isPlaceSelected(place.id) 
                                ? removePlaceFromSelected(place.id)
                                : addPlaceToSelected(place)
                              }
                              className="add-btn"
                            >
                              {isPlaceSelected(place.id) ? "담기 취소" : "여행에 담기"}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* 내 여행 담은 목록 탭 */
              <div className="selected-tab">
                {selectedPlaces.length === 0 ? (
                  <EmptyState
                    icon="📝"
                    title="담은 장소가 없습니다"
                    description="추천 관광지에서 여행지를 선택해보세요."
                    size="small"
                  />
                ) : (
                  <>
                    <div className="selected-places-list">
                      {selectedPlaces.map(place => (
                        <div key={place.id} className="selected-place-item">
                          <div className="place-order">{place.order}</div>
                          
                          <div className="place-thumbnail">
                            <Image
                              src={place.imageUrl || "https://via.placeholder.com/60x60"}
                              alt={place.name}
                              width={60}
                              height={60}
                              className="img"
                            />
                          </div>

                          <div className="place-info">
                            <div className="place-category">{place.category}</div>
                            <h4 className="place-name">{place.name}</h4>
                            {place.duration && (
                              <div className="place-duration">
                                <FaClock />
                                <span>{place.duration}분</span>
                              </div>
                            )}
                          </div>

                          <button
                            className="remove-btn"
                            onClick={() => removePlaceFromSelected(place.id)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* 경로 최적화 버튼 */}
                    <div className="action-buttons">
                      <Button
                        variant="primary"
                        size="large"
                        onClick={handleOptimizeRoute}
                        disabled={isOptimizing || selectedPlaces.length < 2}
                        leftIcon={<FaRoute />}
                        className="optimize-btn"
                      >
                        {isOptimizing ? "최적화 중..." : "경로 최적화"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutTitleWithActions>
  );
}
