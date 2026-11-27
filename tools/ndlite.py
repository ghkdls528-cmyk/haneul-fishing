"""scipy.ndimage 일부를 numpy만으로 대신 (이 PC에서 scipy DLL이 앱 제어 정책에 막힐 때 사용)
쓰는 법: try: from scipy import ndimage as nd  except Exception: import ndlite as nd"""
import numpy as np
from collections import deque
def _shift(a,dy,dx):
    out=np.zeros_like(a);H,W=a.shape
    ys=slice(max(0,dy),H+min(0,dy));yd=slice(max(0,-dy),H+min(0,-dy));xs=slice(max(0,dx),W+min(0,dx));xd=slice(max(0,-dx),W+min(0,-dx))
    out[ys,xs]=a[yd,xd];return out
def binary_dilation(a,iterations=1):
    a=np.asarray(a,bool)
    for _ in range(iterations):a=a|_shift(a,1,0)|_shift(a,-1,0)|_shift(a,0,1)|_shift(a,0,-1)
    return a
def binary_erosion(a,iterations=1):
    a=np.asarray(a,bool)
    for _ in range(iterations):a=a&_shift(a,1,0)&_shift(a,-1,0)&_shift(a,0,1)&_shift(a,0,-1)
    return a
def binary_opening(a,iterations=1):return binary_dilation(binary_erosion(a,iterations),iterations)
def binary_closing(a,iterations=1):return binary_erosion(binary_dilation(a,iterations),iterations)
def label(a):
    a=np.asarray(a,bool);H,W=a.shape;lab=np.zeros((H,W),np.int32);n=0
    ys,xs=np.nonzero(a)
    for y0,x0 in zip(ys,xs):
        if lab[y0,x0]:continue
        n+=1;lab[y0,x0]=n;q=deque([(y0,x0)])
        while q:
            y,x=q.popleft()
            for yy,xx in((y+1,x),(y-1,x),(y,x+1),(y,x-1)):
                if 0<=yy<H and 0<=xx<W and a[yy,xx] and not lab[yy,xx]:lab[yy,xx]=n;q.append((yy,xx))
    return lab,n
def sum(input,labels,index):
    input=np.asarray(input,float);return np.array([input[labels==i].sum() for i in index])
def binary_fill_holes(a):
    a=np.asarray(a,bool);bg=~a;H,W=a.shape;out=np.zeros_like(a);q=deque()
    for y in range(H):
        for x in (0,W-1):
            if bg[y,x] and not out[y,x]:out[y,x]=True;q.append((y,x))
    for x in range(W):
        for y in (0,H-1):
            if bg[y,x] and not out[y,x]:out[y,x]=True;q.append((y,x))
    while q:
        y,x=q.popleft()
        for yy,xx in((y+1,x),(y-1,x),(y,x+1),(y,x-1)):
            if 0<=yy<H and 0<=xx<W and bg[yy,xx] and not out[yy,xx]:out[yy,xx]=True;q.append((yy,xx))
    return ~out
def center_of_mass(input,labels=None,index=None):
    m=np.asarray(input,float) if labels is None else (np.asarray(labels)==index)*np.asarray(input,float)
    ys,xs=np.nonzero(m);w=m[ys,xs];return (float((ys*w).sum()/w.sum()),float((xs*w).sum()/w.sum()))
def gaussian_filter(a,sigma):
    from PIL import Image,ImageFilter
    a=np.asarray(a,float);mx=a.max() or 1;im=Image.fromarray((a/mx*255).astype('uint8')).filter(ImageFilter.GaussianBlur(sigma))
    return np.asarray(im,float)/255*mx
def uniform_filter(a,size):
    a=np.asarray(a,float);k=size//2;p=np.pad(a,k,mode='edge');c=p.cumsum(0).cumsum(1);c=np.pad(c,((1,0),(1,0)))
    H,W=a.shape;return (c[size:size+H,size:size+W]-c[:H,size:size+W]-c[size:size+H,:W]+c[:H,:W])/(size*size)
