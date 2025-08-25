import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Modal, TextInput, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text, spacing, radii, useThemeColor, textVariants } from '@/components/Themed';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConfigureGoalScreen() {
  const { template, methods } = useLocalSearchParams<{ template?: string; methods?: string }>();
  const verificationMethods = useMemo(() => (methods ? methods.split(',').filter(Boolean) : []), [methods]);
  const isTemplate = !!template;
  const templateId = template;
  const isCustom = !isTemplate;
  const insets = useSafeAreaInsets();

  const card = useThemeColor({}, 'card');
  const muted = useThemeColor({}, 'mutedForeground');
  const mutedBg = useThemeColor({}, 'muted');
  const border = useThemeColor({}, 'border');
  const accent = useThemeColor({}, 'accent');
  const warning = useThemeColor({}, 'warning');
  const blue = useThemeColor({}, 'blue');

  // Recurrence chips state
  const weekDays = ['M','T','W','T2','F','S','S2'] as const; // differentiate duplicate letters internally
  const dayLabels: Record<string,string> = { M:'M', T:'T', W:'W', T2:'T', F:'F', S:'S', S2:'S'};
  const [selectedDays, setSelectedDays] = useState<string[]>(['T']);
  const toggleDay = (d: string) => setSelectedDays(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev, d]);

  // Determine which fields show (same logic as earlier but for layout grouping)
  const showName = isTemplate ? templateId !== 'nophone' : true;
  const showStartDate = isTemplate || verificationMethods.some(m=>['time-range','duration','time'].includes(m));
  const showEndDate = showStartDate;
  const showRecurrence = isTemplate || verificationMethods.length>0;
  const showStartTime = (templateId === 'nophone') || verificationMethods.includes('time-range') || verificationMethods.includes('time');
  const showEndTime = (templateId === 'nophone') || verificationMethods.includes('time-range');
  const showDuration = verificationMethods.includes('duration');
  const showTimeSingle = verificationMethods.includes('time');
  const showLocation = verificationMethods.includes('location');
  const showPhoto = verificationMethods.includes('photo');
  const showStake = true;
  const showBeneficiary = true; // always for financial stake list group

  // Form state (typed values)
  const [goalName, setGoalName] = useState('Go to the gym');
  const [startDate, setStartDate] = useState<Date>(new Date(2025,3,1));
  const [endDate, setEndDate] = useState<Date>(new Date(2025,3,1));
  const [startTime, setStartTime] = useState<{h:number;m:number}>({h:8,m:15});
  const [endTime, setEndTime] = useState<{h:number;m:number}>({h:20,m:30});
  const [duration, setDuration] = useState<{h:number;m:number}>({h:0,m:0});
  const [timeSingle, setTimeSingle] = useState<{h:number;m:number}>({h:6,m:15});
  const [location, setLocation] = useState('Select Location');
  const [photoDesc, setPhotoDesc] = useState('Enter a description');
  const [stake, setStake] = useState('10');
  const [beneficiary, setBeneficiary] = useState('Devs');

  type Editor =
    | { type: 'name' }
    | { type: 'startDate' }
    | { type: 'endDate' }
    | { type: 'startTime' }
    | { type: 'endTime' }
    | { type: 'timeSingle' }
    | { type: 'duration' }
    | { type: 'location' }
    | { type: 'photo' }
    | { type: 'stake' }
    | { type: 'beneficiary' }
    | null;
  const [editor, setEditor] = useState<Editor>(null);

  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = ({h,m}:{h:number;m:number}) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const hr12 = ((h + 11) % 12) + 1;
    return `${hr12}:${m.toString().padStart(2,'0')} ${period}`;
  };
  const formatDuration = ({h,m}:{h:number;m:number}) => `${h.toString().padStart(2,'0')}h ${m.toString().padStart(2,'0')}m`;

  const Pill = ({ value, onPress }: { value: string; onPress?: ()=>void }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pill, { backgroundColor: mutedBg, opacity: pressed ? 0.85 : 1 }]}
    >
      <Text style={textVariants.subheadline}>{value}</Text>
    </Pressable>
  );

  const TwoCol = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.twoColRow}>{children}</View>
  );

  const Label = ({ children }: { children: React.ReactNode }) => (
    <Text style={[textVariants.caption1Emphasized, { color: muted, marginBottom: spacing.xs }]}>{children}</Text>
  );

  return (
    <>
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.headerContentInset, paddingTop: spacing.lg, paddingBottom: spacing.xxl + 100 }}
      >
        {isCustom && (
          <Text style={[textVariants.subheadline, { color: muted, marginBottom: spacing.sm }]}>Step 3 of 3</Text>
        )}
        {/* Goal Name */}
        {showName && (
          <View style={{ marginBottom: spacing.xl }}>
            <Label>GOAL NAME</Label>
            <Pressable style={({ pressed }) => [styles.nameRow, { backgroundColor: card, borderColor: border, opacity: pressed ? 0.9 : 1 }]} onPress={()=>setEditor({type:'name'})}>
              <Text style={textVariants.subheadlineEmphasized}>Name</Text>
              <Text style={[textVariants.subheadline, { color: muted }]} numberOfLines={1}>{goalName}  ›</Text>
            </Pressable>
          </View>
        )}
        {/* Dates */}
        {(showStartDate || showEndDate) && (
          <TwoCol>
            {showStartDate && (
              <View style={styles.colItem}>
                <Label>START DATE</Label>
                <Pill value={formatDate(startDate)} onPress={()=>setEditor({type:'startDate'})} />
              </View>
            )}
            {showEndDate && (
              <View style={styles.colItem}>
                <Label>END DATE</Label>
                <Pill value={formatDate(endDate)} onPress={()=>setEditor({type:'endDate'})} />
              </View>
            )}
          </TwoCol>
        )}
        {/* Recurrence */}
        {showRecurrence && (
          <View style={{ marginTop: spacing.xl }}>
            <Label>RECURRENCE</Label>
            <View style={styles.weekRow}>
              {weekDays.map(d => {
                const active = selectedDays.includes(d);
                return (
                  <Pressable
                    key={d}
                    onPress={() => toggleDay(d)}
                    style={({ pressed }) => [
                      styles.dayChip,
                      { backgroundColor: active ? blue : mutedBg, opacity: pressed ? 0.85 : 1 },
                    ]}
                  >
                    <Text style={[textVariants.subheadlineEmphasized, { color: active ? '#fff' : undefined }]}>{dayLabels[d]}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
        {/* Time Fields */}
        {(showStartTime || showEndTime) && (
          <TwoCol>
            {showStartTime && (
              <View style={styles.colItem}>
                <Label>START TIME</Label>
                <Pill value={formatTime(startTime)} onPress={()=>setEditor({type:'startTime'})} />
              </View>
            )}
            {showEndTime && (
              <View style={styles.colItem}>
                <Label>END TIME</Label>
                <Pill value={formatTime(endTime)} onPress={()=>setEditor({type:'endTime'})} />
              </View>
            )}
          </TwoCol>
        )}
        {(showDuration || showTimeSingle) && (
          <TwoCol>
            {showDuration && (
              <View style={styles.colItem}>
                <Label>DURATION</Label>
                <Pill value={formatDuration(duration)} onPress={()=>setEditor({type:'duration'})} />
              </View>
            )}
            {showTimeSingle && (
              <View style={styles.colItem}>
                <Label>TIME</Label>
                <Pill value={formatTime(timeSingle)} onPress={()=>setEditor({type:'timeSingle'})} />
              </View>
            )}
          </TwoCol>
        )}
        {(showLocation || showPhoto) && (
          <TwoCol>
            {showLocation && (
              <View style={styles.colItem}>
                <Label>LOCATION</Label>
                <Pill value={location} onPress={()=>setEditor({type:'location'})} />
              </View>
            )}
            {showPhoto && (
              <View style={styles.colItem}>
                <Label>PHOTO VALIDATION</Label>
                <Pill value={photoDesc} onPress={()=>setEditor({type:'photo'})} />
              </View>
            )}
          </TwoCol>
        )}
        {/* Financial Stake */}
        {(showStake || showBeneficiary) && (
          <View style={{ marginTop: spacing.xl }}>
            <Label>FINANCIAL STAKE (CHF)</Label>
            <View style={styles.listGroupWrapper}>
              <Pressable style={({ pressed }) => [styles.listRow, { backgroundColor: card, borderColor: border, borderTopLeftRadius: radii.md, borderTopRightRadius: radii.md, opacity: pressed ? 0.9 : 1 }]} onPress={()=>setEditor({type:'stake'})}>
                <Text style={textVariants.subheadlineEmphasized}>Stake</Text>
                <Text style={textVariants.subheadline}>{stake}  ›</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.listRow, { backgroundColor: card, borderColor: border, borderBottomLeftRadius: radii.md, borderBottomRightRadius: radii.md, opacity: pressed ? 0.9 : 1, borderTopWidth: 0 }]} onPress={()=>setEditor({type:'beneficiary'})}>
                <Text style={textVariants.subheadlineEmphasized}>Beneficiary</Text>
                <Text style={textVariants.subheadline}>{beneficiary}  ›</Text>
              </Pressable>
            </View>
            <Text style={[textVariants.caption1Emphasized, { color: warning, marginTop: spacing.md, textAlign: 'center', paddingHorizontal: spacing.md }]}>The amount above will be sent to the chosen beneficiary should you fail to complete the goal.</Text>
          </View>
        )}
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.headerContentInset, paddingBottom: insets.bottom + spacing.lg, paddingTop: spacing.md }}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ backgroundColor: accent, borderRadius: radii.lg, alignItems: 'center', paddingVertical: spacing.lg, opacity: pressed ? 0.9 : 1 }]}
        >
          <Text style={textVariants.subheadlineEmphasized}>Create Goal  ›</Text>
        </Pressable>
      </View>
  </SafeAreaView>
  {editor && (
      <InlineEditor editor={editor} onClose={()=>setEditor(null)}
        state={{goalName,setGoalName,startDate,setStartDate,endDate,setEndDate,startTime,setStartTime,endTime,setEndTime,timeSingle,setTimeSingle,duration,setDuration,location,setLocation,photoDesc,setPhotoDesc,stake,setStake,beneficiary,setBeneficiary}} />
    )}
  </>
  );
}

function InlineEditor({ editor, onClose, state }:{ editor:any; onClose:()=>void; state:any }) {
  const { goalName,setGoalName,startDate,setStartDate,endDate,setEndDate,startTime,setStartTime,endTime,setEndTime,timeSingle,setTimeSingle,duration,setDuration,location,setLocation,photoDesc,setPhotoDesc,stake,setStake,beneficiary,setBeneficiary } = state;
  const isDate = editor.type==='startDate' || editor.type==='endDate';
  const isTime = ['startTime','endTime','timeSingle'].includes(editor.type);
  const isDuration = editor.type==='duration';
  const isText = ['name','location','photo'].includes(editor.type);
  const isStake = editor.type==='stake';
  const isBeneficiary = editor.type==='beneficiary';
  // theme colors for contrast highlights
  const accent = useThemeColor({}, 'accent');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const monthState = React.useState<Date>((editor.type==='endDate'? endDate : startDate));
  const [month,setMonth] = monthState;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth()+1,0).getDate();
  const firstWeekday = new Date(month.getFullYear(), month.getMonth(),1).getDay();
  const cells:(Date|null)[]=[]; for(let i=0;i<firstWeekday;i++) cells.push(null); for(let d=1; d<=daysInMonth; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));
  const selectDate=(d:Date)=>{ if(editor.type==='startDate') setStartDate(d); else setEndDate(d); onClose(); };
  const formatTime = ({h,m}:{h:number;m:number}) => { const period = h>=12?'PM':'AM'; const hr12=((h+11)%12)+1; return `${hr12}:${m.toString().padStart(2,'0')} ${period}`; };
  const timeItems=Array.from({length:24},(_,h)=>h); const minuteItems=[0,15,30,45];
  const setTime=(h:number,m:number)=>{ const obj={h,m}; if(editor.type==='startTime') setStartTime(obj); else if(editor.type==='endTime') setEndTime(obj); else setTimeSingle(obj); };
  const durHours=Array.from({length:13},(_,h)=>h); const durMinutes=[0,15,30,45];
  const beneficiaries=['Devs','Red Cross','WWF','UNICEF','Doctors Without Borders'];
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.backdrop}>
        <View style={modalStyles.container}>
          {/* Header */}
          <View style={modalStyles.header}><Text style={{fontWeight:'600'}}>{
            isDate? 'Select Date' : isTime? 'Select Time' : isDuration? 'Select Duration' : isText? 'Enter Text' : isStake? 'Stake (CHF)' : 'Beneficiary'
          }</Text><Pressable onPress={onClose}><Text>✕</Text></Pressable></View>
          {isDate && (
            <View style={{flex:1}}>
              <View style={modalStyles.calendarHeader}>
                <Pressable onPress={()=>setMonth(new Date(month.getFullYear(), month.getMonth()-1,1))}><Text>{'<'}</Text></Pressable>
                <Text style={{fontWeight:'600'}}>{month.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</Text>
                <Pressable onPress={()=>setMonth(new Date(month.getFullYear(), month.getMonth()+1,1))}><Text>{'>'}</Text></Pressable>
              </View>
              <View style={modalStyles.weekDaysRow}>{['S','M','T','W','T','F','S'].map(d=> <Text key={d} style={modalStyles.weekDay}>{d}</Text>)}</View>
              <View style={modalStyles.daysGrid}>{cells.map((d,i)=> d? <Pressable key={i} style={modalStyles.dayCell} onPress={()=>selectDate(d)}><Text>{d.getDate()}</Text></Pressable>: <View key={i} style={modalStyles.dayCell}/> )}</View>
            </View>
          )}
          {isTime && (
            <View style={{flex:1, flexDirection:'row'}}>
              <FlatList
                data={timeItems}
                keyExtractor={i=>`h${i}`}
                style={{flex:1}}
                renderItem={({item})=> {
                  const current = editor.type==='endTime'? endTime : editor.type==='startTime'? startTime : timeSingle;
                  const selected = item === current.h;
                  return (
                    <Pressable
                      style={[modalStyles.listItem, selected && { backgroundColor: accent, borderRadius: 8 }]}
                      onPress={()=>setTime(item,current.m)}
                    >
                      <Text style={selected? { color:'#fff', fontWeight:'600' }: undefined}>{item.toString().padStart(2,'0')}</Text>
                    </Pressable>
                  );
                }}
              />
              <FlatList
                data={minuteItems}
                keyExtractor={i=>`m${i}`}
                style={{flex:1}}
                renderItem={({item})=> {
                  const current = editor.type==='endTime'? endTime : editor.type==='startTime'? startTime : timeSingle;
                  const selected = item === current.m;
                  return (
                    <Pressable
                      style={[modalStyles.listItem, selected && { backgroundColor: accent, borderRadius: 8 }]}
                      onPress={()=>setTime(current.h,item)}
                    >
                      <Text style={selected? { color:'#fff', fontWeight:'600' }: undefined}>{item.toString().padStart(2,'0')}</Text>
                    </Pressable>
                  );
                }}
              />
            </View>
          )}
          {isDuration && (
            <View style={{flex:1, flexDirection:'row'}}>
              <FlatList
                data={durHours}
                keyExtractor={i=>`dh${i}`}
                style={{flex:1}}
                renderItem={({item})=> {
                  const selected = item === duration.h;
                  return (
                    <Pressable
                      style={[modalStyles.listItem, selected && { backgroundColor: accent, borderRadius: 8 }]}
                      onPress={()=>setDuration({h:item,m:duration.m})}
                    >
                      <Text style={selected? { color:'#fff', fontWeight:'600' }: undefined}>{item}h</Text>
                    </Pressable>
                  );
                }}
              />
              <FlatList
                data={durMinutes}
                keyExtractor={i=>`dm${i}`}
                style={{flex:1}}
                renderItem={({item})=> {
                  const selected = item === duration.m;
                  return (
                    <Pressable
                      style={[modalStyles.listItem, selected && { backgroundColor: accent, borderRadius: 8 }]}
                      onPress={()=>setDuration({h:duration.h,m:item})}
                    >
                      <Text style={selected? { color:'#fff', fontWeight:'600' }: undefined}>{item}m</Text>
                    </Pressable>
                  );
                }}
              />
            </View>
          )}
          {isText && (
            <TextInput autoFocus multiline={editor.type==='photo'} style={modalStyles.input}
              value={editor.type==='name'? goalName : editor.type==='location'? location : photoDesc}
              onChangeText={t=>{ if(editor.type==='name') setGoalName(t); else if(editor.type==='location') setLocation(t); else setPhotoDesc(t); }} />
          )}
          {isStake && (
            <TextInput autoFocus keyboardType='number-pad' style={modalStyles.input} value={stake} onChangeText={setStake} />
          )}
          {isBeneficiary && (
            <FlatList data={beneficiaries} keyExtractor={i=>i} renderItem={({item})=> <Pressable style={modalStyles.listItem} onPress={()=>{setBeneficiary(item); onClose();}}><Text style={{fontWeight:item===beneficiary?'600':'400'}}>{item}</Text></Pressable>} />
          )}
          <Pressable style={modalStyles.confirmBtn} onPress={onClose}><Text>{isDate? 'Cancel' : 'Done'}</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderWidth: 1,
    borderRadius: radii.md,
  },
  twoColRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    gap: spacing.xl,
  },
  colItem: { flex: 1 },
  weekRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  dayChip: {
    width: 46,
    height: 46,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listGroupWrapper: { marginTop: spacing.sm },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderWidth: 1,
  },
});

const modalStyles = StyleSheet.create({
  backdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', padding: spacing.lg },
  container: { backgroundColor:'#fff', borderRadius: radii.lg, padding: spacing.lg, height: 420 },
  header: { flexDirection:'row', justifyContent:'space-between', marginBottom: spacing.sm },
  calendarHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: spacing.sm },
  weekDaysRow: { flexDirection:'row', justifyContent:'space-between', marginBottom: spacing.xs },
  weekDay: { width:30, textAlign:'center', fontWeight:'600' },
  daysGrid: { flexDirection:'row', flexWrap:'wrap' },
  dayCell: { width:30, height:36, justifyContent:'center', alignItems:'center' },
  listItem: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  input: { borderWidth:1, borderColor:'#ccc', borderRadius: radii.md, padding: spacing.md, minHeight: 60, textAlignVertical:'top', marginBottom: spacing.md },
  confirmBtn: { alignSelf:'center', marginTop: spacing.md, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, backgroundColor:'#eee', borderRadius: radii.md },
});
