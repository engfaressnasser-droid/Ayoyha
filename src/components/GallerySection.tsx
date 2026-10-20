import React, { useState } from 'react';
import { Camera, Maximize2, X, ChevronRight, ChevronLeft, Plus, Heart, Trash2, UploadCloud, Edit3, Sparkles } from 'lucide-react';
import { MemoryImage } from '../types';

interface GallerySectionProps {
  memories: MemoryImage[];
  onAddMemory: (newMemory: MemoryImage) => void;
  onAddMultipleMemories?: (newMemories: MemoryImage[]) => void;
  onUpdateMemory?: (updatedMemory: MemoryImage) => void;
  onDeleteMemory?: (id: string) => void;
  canEdit?: boolean;
  galleryTitle?: string;
  gallerySubtitle?: string;
  onEditSection?: (tab: 'basic' | 'hero' | 'letters' | 'reasons' | 'gallery' | 'cake' | 'music' | 'footer') => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  memories,
  onAddMemory,
  onAddMultipleMemories,
  onUpdateMemory,
  onDeleteMemory,
  canEdit = true,
  galleryTitle = 'معرض صورنا وذكرياتنا الحلوة',
  gallerySubtitle = 'ألبوم حكاياتنا وسنين حبنا · أول ما اتعرفنا على بعض 21 يوليو 2026',
  onEditSection,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [editingMemory, setEditingMemory] = useState<MemoryImage | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<MemoryImage | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);

  React.useEffect(() => {
    // Clear image error state whenever memories update so new/updated photos render immediately
    setImgErrors({});
  }, [memories]);

  // Photo form state (used for both Add and Edit)
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const openAddModal = () => {
    setEditingMemory(null);
    setNewTitle('');
    setNewDate('');
    setNewCaption('');
    setNewUrl('');
    setPreviewUrl('');
    setShowUploadModal(true);
  };

  const openEditModal = (mem: MemoryImage) => {
    setEditingMemory(mem);
    setNewTitle(mem.title || '');
    setNewDate(mem.date || '');
    setNewCaption(mem.caption || '');
    setNewUrl(mem.imageUrl && !mem.imageUrl.startsWith('data:') ? mem.imageUrl : '');
    setPreviewUrl(mem.imageUrl || '');
    setShowUploadModal(true);
  };

  const handleConfirmDelete = () => {
    if (photoToDelete) {
      const id = photoToDelete.id;
      onDeleteMemory?.(id);
      if (selectedImageIndex !== null && memories[selectedImageIndex]?.id === id) {
        closeLightbox();
      }
      setPhotoToDelete(null);
    }
  };

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'unset';
  };

  const showNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % memories.length);
    }
  };

  const showPrev = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + memories.length) % memories.length);
    }
  };

  // Fast client-side image compression so photos fit smoothly into storage without failing
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (!result || typeof result !== 'string') {
          resolve('');
          return;
        }

        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const maxDim = 1080;
            let width = img.width;
            let height = img.height;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(result);
              return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.80);
            resolve(compressed || result);
          } catch {
            resolve(result);
          }
        };
        img.onerror = () => {
          // If Image() fails to decode, fallback directly to reader base64 result
          resolve(result);
        };
        img.src = result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImage(true);

    try {
      if (!editingMemory && files.length > 1) {
        const batch: MemoryImage[] = [];
        for (let idx = 0; idx < files.length; idx++) {
          const file = files[idx];
          const compressedUrl = await compressImageFile(file);
          if (compressedUrl) {
            batch.push({
              id: 'photo_' + Date.now() + '_' + idx + '_' + Math.random().toString(36).substring(2, 6),
              title: file.name.replace(/\.[^/.]+$/, '') || `صورتنا الحلوة #${memories.length + idx + 1}`,
              date: 'لحظة خاصة',
              caption: 'ذكرى حلوة من أجمل أيامنا سوا ❤️',
              imageUrl: compressedUrl,
              fallbackGradient: 'from-rose-950 via-purple-950 to-neutral-950',
            });
          }
        }
        if (batch.length > 0) {
          if (onAddMultipleMemories) {
            onAddMultipleMemories(batch);
          } else {
            batch.forEach((b) => onAddMemory(b));
          }
        }
        setShowUploadModal(false);
        return;
      }

      const file = files[0];
      const compressedUrl = await compressImageFile(file);
      if (compressedUrl) {
        setPreviewUrl(compressedUrl);
        setNewUrl('');
        if (!newTitle) {
          const autoTitle = file.name.replace(/\.[^/.]+$/, '').trim();
          setNewTitle(autoTitle && !autoTitle.startsWith('image') ? autoTitle : 'صورتنا الحلوة');
        }
        if (!newDate) {
          setNewDate('لحظة خاصة');
        }
      }
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = previewUrl || newUrl.trim();
    if (!finalUrl && !newTitle.trim() && !editingMemory) return;

    if (editingMemory) {
      const updatedPhoto: MemoryImage = {
        ...editingMemory,
        title: newTitle.trim() || editingMemory.title || 'ذكرى حلوة لينا',
        date: newDate.trim() || editingMemory.date || 'لحظة خاصة',
        caption: newCaption.trim() || editingMemory.caption || 'ذكرى لا تُنسى في قصة حبنا الجميلة.',
        imageUrl: finalUrl || editingMemory.imageUrl,
      };
      onUpdateMemory?.(updatedPhoto);
    } else {
      const newPhoto: MemoryImage = {
        id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        title: newTitle.trim() || 'صورتنا الحلوة',
        date: newDate.trim() || 'لحظة خاصة',
        caption: newCaption.trim() || 'ذكرى لا تُنسى من أجمل أيامنا سوا ❤️',
        imageUrl: finalUrl || '/uploads/photo_1792489959014_33id2i.jpg',
        fallbackGradient: 'from-rose-950 via-purple-950 to-neutral-950',
      };
      onAddMemory(newPhoto);
    }

    setShowUploadModal(false);
    setEditingMemory(null);
    setNewTitle('');
    setNewDate('');
    setNewCaption('');
    setNewUrl('');
    setPreviewUrl('');
  };

  const activePhoto = selectedImageIndex !== null ? memories[selectedImageIndex] : null;

  return (
    <section id="gallery" className="relative py-14 sm:py-24 px-3 sm:px-6 max-w-6xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-rose-600/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-12">
        <div className="text-center sm:text-right">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-rose-400 text-xs sm:text-sm font-medium tracking-wider mb-2">
            <span>{gallerySubtitle}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              {galleryTitle}
            </h2>
            {canEdit && onEditSection && (
              <button
                type="button"
                onClick={() => onEditSection('gallery')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/80 hover:bg-rose-900 text-amber-200 text-xs transition-all cursor-pointer border border-rose-700/50 shadow"
                title="تعديل عناوين المعرض"
              >
                <Edit3 className="w-3 h-3 text-amber-300" />
                <span>تعديل</span>
              </button>
            )}
          </div>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white border border-rose-400/40 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-lg shadow-rose-950/50 hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>ارفع صورة جديدة لينا 📸</span>
          </button>
        )}
      </div>

      {/* Empty State when no photos exist */}
      {memories.length === 0 ? (
        <div className="w-full rounded-2xl sm:rounded-3xl border-2 border-dashed border-rose-800/40 bg-neutral-900/40 backdrop-blur-sm p-6 sm:p-16 text-center flex flex-col items-center justify-center box-glow">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-950/60 border border-rose-600/40 flex items-center justify-center text-rose-400 mb-4 sm:mb-6 shadow-inner animate-pulse">
            <Camera className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3">
            {canEdit ? 'ألبوم صوركم مستني ذكرياتكم الحلوة 💖' : 'ألبوم حكايتنا مستني ذكرياتنا الحلوة 💖'}
          </h3>
          <p className="text-xs sm:text-sm text-rose-200/70 max-w-md mx-auto mb-6 sm:mb-8 font-poetry leading-relaxed px-2">
            {canEdit
              ? 'المكان ده مخصص لصوركم سوا.. اضغط على الزر تحت وارفع صوركم الحلوة من موبايلك عشان تظهر هنا فوراً وتكبر لما تدوسوا عليها!'
              : 'المكان ده مخصص لأجمل صورنا سوا.. أول ما فارس يرفع الصور هتظهر هنا بحجمها الكامل وألوانها الدافية يا ست البنات ❤️'}
          </p>

          {canEdit ? (
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-2xl shadow-xl shadow-rose-900/50 hover:scale-105 active:scale-95 transition-all cursor-pointer text-xs sm:text-sm"
            >
              <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
              <span>ارفع أول صورة لقصتنا الحلوة 📸</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-rose-300/80 text-xs sm:text-sm font-medium">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/30 animate-pulse" />
              <span>ذكرياتنا الحلوة منورة قلوبنا دايماً 🌸</span>
            </div>
          )}
        </div>
      ) : (
        /* Photo Grid with Real Photos */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {memories.map((mem, idx) => {
            const hasError = !mem.imageUrl || imgErrors[mem.id];

            return (
              <div
                key={mem.id}
                className="group relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-rose-900/40 bg-neutral-900/80 cursor-pointer transition-all duration-300 hover:border-rose-500/60 hover:shadow-2xl hover:shadow-rose-950/60"
              >
                {/* Edit & Delete buttons (accessible on touch mobile and desktop) */}
                {canEdit && (
                  <div className="absolute top-2.5 left-2.5 z-30 flex items-center gap-1.5">
                    {onDeleteMemory && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotoToDelete(mem);
                        }}
                        title="مسح هذه الصورة"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-950/90 hover:bg-red-600 border border-red-500/50 text-red-200 hover:text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(mem);
                      }}
                      title="تعديل بيانات الصورة"
                      className="px-2.5 h-8 sm:h-9 rounded-full bg-rose-950/90 hover:bg-rose-600 border border-rose-500/50 text-amber-200 hover:text-white flex items-center justify-center gap-1 transition-all shadow-lg cursor-pointer text-[11px] font-bold"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>تعديل</span>
                    </button>
                  </div>
                )}

                {/* Main Image clickable for Lightbox */}
                <div onClick={() => openLightbox(idx)} className="w-full h-full">
                  {!hasError ? (
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      onError={() => handleImageError(mem.id)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${mem.fallbackGradient} flex flex-col items-center justify-center p-6 text-center`}>
                      <div className="w-12 h-12 rounded-full bg-rose-900/40 border border-rose-600/30 flex items-center justify-center mb-2 text-rose-300">
                        <Heart className="w-6 h-6 fill-rose-500/20" />
                      </div>
                      <span className="text-sm font-semibold text-rose-100 mb-1">{mem.title}</span>
                      <span className="text-xs text-rose-300/70">{mem.date}</span>
                    </div>
                  )}

                  {/* Gradient Overlay Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-95 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] sm:text-xs text-rose-400 font-medium tracking-wide">
                        {mem.date}
                      </span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:text-white group-hover:bg-rose-600 transition-colors">
                        <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </div>
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-white group-hover:text-rose-200 transition-colors line-clamp-1">
                      {mem.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-rose-200/70 line-clamp-2 mt-0.5 sm:mt-1">
                      {mem.caption}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Add Card at the end of grid */}
          {canEdit && (
            <div
              onClick={openAddModal}
              className="h-64 sm:h-80 rounded-2xl border-2 border-dashed border-rose-800/40 bg-neutral-900/30 hover:bg-rose-950/20 hover:border-rose-500/60 cursor-pointer transition-all flex flex-col items-center justify-center p-6 text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-700/40 flex items-center justify-center text-rose-400 mb-3 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-white group-hover:text-rose-200 transition-colors">
                ضيف صورة تانية للألبوم
              </span>
              <span className="text-xs text-rose-300/60 mt-1">
                من الموبايل أو الكمبيوتر
              </span>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal (responsive on mobile) */}
      {selectedImageIndex !== null && activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Controls Bar */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 flex items-center gap-2">
            {canEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const photo = activePhoto;
                  closeLightbox();
                  openEditModal(photo);
                }}
                title="تعديل بيانات الصورة"
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-rose-950/80 hover:bg-rose-600 border border-rose-500/40 text-amber-200 hover:text-white text-xs font-medium transition-colors cursor-pointer shadow-lg"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>تعديل الصورة</span>
              </button>
            )}
            {canEdit && onDeleteMemory && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotoToDelete(activePhoto);
                }}
                title="مسح هذه الصورة"
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-red-950/80 hover:bg-red-600 border border-red-500/40 text-white text-xs font-medium transition-colors cursor-pointer shadow-lg"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-300" />
                <span className="hidden sm:inline">مسح الصورة</span>
              </button>
            )}
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="إغلاق المعرض"
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Navigation buttons */}
          {memories.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="الصورة اللي فاتت"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-neutral-900/80 hover:bg-rose-600 text-white transition-colors border border-white/10 z-40"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="الصورة اللي بعد كدة"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-neutral-900/80 hover:bg-rose-600 text-white transition-colors border border-white/10 z-40"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Central Modal Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center overflow-hidden rounded-2xl bg-[#120a1c] border border-rose-900/40 shadow-2xl"
          >
            <div className="w-full max-h-[55vh] sm:max-h-[65vh] overflow-hidden flex items-center justify-center bg-black">
              {activePhoto.imageUrl && !imgErrors[activePhoto.id] ? (
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="max-h-[55vh] sm:max-h-[65vh] w-auto max-w-full object-contain"
                />
              ) : (
                <div className={`w-full h-64 bg-gradient-to-br ${activePhoto.fallbackGradient} flex flex-col items-center justify-center p-6 text-center`}>
                  <Heart className="w-12 h-12 text-rose-400 mb-2" />
                  <span className="text-lg font-bold text-white">{activePhoto.title}</span>
                </div>
              )}
            </div>

            {/* Captions and details */}
            <div className="w-full p-4 sm:p-6 text-right bg-[#140a1c] border-t border-rose-900/30 overflow-y-auto">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <span className="text-xs font-mono text-rose-400">
                  {selectedImageIndex + 1} / {memories.length}
                </span>
                <span className="text-xs text-rose-300/80 font-medium">
                  {activePhoto.date}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                {activePhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed font-poetry">
                {activePhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Memory Modal */}
      {showUploadModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#140b1e] border border-rose-800/40 rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 sm:p-6 text-right shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-rose-900/40 mb-4">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {editingMemory ? 'تعديل الصورة والذكرى ✏️' : 'إضافة صورة لقصتنا الحلوة 📸'}
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-rose-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} noValidate className="space-y-3.5">
              {/* Direct Upload from Device */}
              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1.5">
                  {editingMemory ? 'تغيير الصورة من موبايلك أو الكمبيوتر (اختياري)' : 'اختار الصورة من موبايلك أو الكمبيوتر'}
                </label>
                <label className="flex flex-col items-center justify-center gap-2 p-4 sm:p-5 border-2 border-dashed border-rose-600/50 rounded-2xl cursor-pointer hover:border-rose-400 hover:bg-rose-950/30 transition-all text-xs text-rose-200 bg-neutral-900/60 text-center">
                  <UploadCloud className="w-7 h-7 text-rose-400 animate-bounce" />
                  <span className="font-semibold text-xs sm:text-sm text-white">
                    {editingMemory ? 'اضغط هنا لو حابب تغير الصورة' : 'اضغط هنا واختار الصور من المعرض'}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-rose-300/60">
                    {editingMemory ? 'أو عدل الاسم والوصف تحت علطول' : 'تقدر تختار صورة أو كذا صورة مع بعض'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple={!editingMemory}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Processing indicator */}
              {isProcessingImage && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center gap-2 text-rose-200 text-xs animate-pulse">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>جاري تجهيز الصورة وضغطها بأعلى جودة... ثواني يا قمر ✨</span>
                </div>
              )}

              {/* Image Preview if chosen */}
              {previewUrl && (
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-rose-700/50 bg-black">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  <span className="absolute bottom-2 right-2 text-[10px] bg-emerald-950/90 border border-emerald-500/40 px-2 py-0.5 rounded text-emerald-200 font-bold">
                    ✓ الصورة جاهزة للحفظ
                  </span>
                </div>
              )}

              {/* Or Direct Image URL */}
              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">
                  أو رابط صورة خارجي (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  value={newUrl}
                  onChange={(e) => {
                    setNewUrl(e.target.value);
                    if (e.target.value.trim()) {
                      setPreviewUrl(e.target.value.trim());
                    }
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">
                  عنوان الصورة أو الموقف
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: يوم ما خرجنا سوا / أحلى صورة لينا"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">
                  التاريخ أو التوقيت
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: 21 يوليو 2026 / الصيف اللي فات"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">
                  كلمة حلوة عن الصورة دي
                </label>
                <textarea
                  rows={2}
                  placeholder="اكتب إيه اللي حسيت بيه في اللحظة دي..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-medium text-rose-300 hover:text-white cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isProcessingImage}
                  className="px-6 py-2.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isProcessingImage ? 'جاري التجهيز...' : editingMemory ? 'حفظ التعديل ✨' : 'حفظ في الألبوم ✨'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom In-App Delete Confirmation Modal */}
      {photoToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setPhotoToDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#190a24] border border-rose-800/60 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl box-glow"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-red-950/80 border border-red-600/40 flex items-center justify-center text-red-400 mb-4 shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              مسح الصورة من الألبوم؟
            </h3>

            <p className="text-xs sm:text-sm text-rose-200/80 mb-6 font-poetry leading-relaxed">
              هل متأكد إنك عاوز تمسح صورة <span className="text-pink-300 font-semibold">«{photoToDelete.title}»</span> من ذكرياتكم؟
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-xs font-medium text-white transition-all cursor-pointer"
              >
                إلغاء / خليها
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-xs font-semibold text-white shadow-lg shadow-red-950/60 transition-all cursor-pointer"
              >
                أيوة، امسحها
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
