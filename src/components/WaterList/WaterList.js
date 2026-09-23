import WaterCard from '@/components/WaterCard'
import WaterSearch from './WaterSearch'
import s from './WaterList.module.scss'

const LIST_ID = 'water-list'

// Cards are rendered as static HTML; only the search box ships JS
export default function WaterList({ sites }) {
    const advisoryCount = sites.filter((site) => site.adviceAgainstBathing?.length > 0).length

    return (
        <div className={s.WaterList}>
            <WaterSearch listId={LIST_ID} total={sites.length} advisoryCount={advisoryCount} />
            <ul id={LIST_ID} className={s['WaterList__List']}>
                {sites.map((site) => (
                    <WaterCard key={site.bathingWater.id} {...site} />
                ))}
            </ul>
        </div>
    )
}
